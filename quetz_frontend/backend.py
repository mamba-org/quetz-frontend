import sys
import os
import logging
import json
import glob
from pathlib import Path

import jinja2
from itertools import chain

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from starlette.staticfiles import StaticFiles
from quetz.deps import get_dao, get_rules, get_session
from quetz.dao import Dao
from quetz import authorization

from quetz.authentication.registry import AuthenticatorRegistry
from quetz.config import Config

logger = logging.getLogger('quetz.frontend')
config = Config()

config_data = {}

from os.path import join as pjoin

mock_router = APIRouter()
catchall_router = APIRouter()

federated_extensions = []

GLOBAL_FRONTEND_DIR = pjoin(sys.prefix, '/share/quetz/frontend/')
GLOBAL_EXTENSIONS_DIR = pjoin(sys.prefix, '/share/quetz/frontend/extensions/')
HERE = os.path.abspath(os.path.dirname(__file__))
LOCAL_FRONTEND_DIR = os.path.join(HERE, "app", "build")

if os.path.exists(LOCAL_FRONTEND_DIR):
    frontend_dir = LOCAL_FRONTEND_DIR
    logger.info("Using local DEVELOPMENT frontend directory.")
elif os.path.exists(GLOBAL_FRONTEND_DIR):
    frontend_dir = GLOBAL_FRONTEND_DIR
else:
    raise RuntimeException(f"Could not find frontend files in:\n- {LOCAL_FRONTEND_DIR}\n- {GLOBAL_FRONTEND_DIR}")

logger.info(f"Successfully found frontend in {frontend_dir}")

def render_index(config):
    global mock_settings_dict
    global index_template

    logger.info("Rendering index.html!")
    static_dir = Path(frontend_dir)
    if (static_dir / ".." / "templates").exists():
        with open(static_dir / "index.html.j2") as fi:
            index_template = jinja2.Template(fi.read())

        with open(static_dir / ".." / "templates" / "settings.json") as fi:
            settings_template = json.load(fi)

        with open(static_dir / ".." / "templates" / "default_settings.json") as fi:
            default_settings = fi.read()

        for setting in settings_template["settings"]:
            if setting["id"] == '@jupyterlab/apputils-extension:themes':
                setting["raw"] = default_settings

        with open(os.path.join(static_dir, "index.html"), "w") as fo:
            fo.write(index_template.render(page_config=config))

        mock_settings_dict = settings_template
        with open(static_dir / "settings.json", "w") as fo:
            fo.write(json.dumps(settings_template))


@mock_router.get('/themes/{resource:path}', include_in_schema=False)
def get_theme(resource: str):
    final_path = os.path.join(frontend_dir, 'themes', resource)
    logger.info(f"Getting file from {frontend_dir}")
    logger.info(final_path)
    if os.path.exists(final_path):
        return FileResponse(path=final_path)
    else:
        raise HTTPException(status_code=404)

@mock_router.get('/extensions/{resource:path}', include_in_schema=False)
def extensions(
    resource: str,
    session: dict = Depends(get_session),
    dao: Dao = Depends(get_dao),
    auth: authorization.Rules = Depends(get_rules),
):
    # user_id = auth.get_user()

    logger.info(f"Extension request: {resource}")
    logger.info(f"Extensions dir: {extensions_dir}")
    logger.info(f"Extension path: {os.path.join(extensions_dir, resource)}")
    # "federated_extensions": [{
    #   "extension": "./extension",
    #   "load": "static/remoteEntry.a1fe33117f8149d71c15.js",
    #   "name": "@mamba-org/gator-lab",
    #   "style": "./style"
    # }]
    return FileResponse(path=os.path.join(extensions_dir, resource))



@catchall_router.get('/{resource:path}', include_in_schema=False)
def index(
    resource: str,
    session: dict = Depends(get_session),
    dao: Dao = Depends(get_dao),
    auth: authorization.Rules = Depends(get_rules),
):
    user_id = auth.get_user()
    logger.info("CATCHALL: {!r}, {!r}, {!r}".format(resource, session, user_id))

    profile = dao.get_profile(user_id)

    if '.' in resource:
        file_name = (
            resource
            if ('icons' in resource or 'logos' in resource or 'page-data' in resource)
            else resource.split('/')[-1]
        )
        path = os.path.join(frontend_dir, file_name)
        if os.path.exists(path):
            return FileResponse(path=path)
        else:
            raise HTTPException(404)
    else:
        static_dir = Path(frontend_dir)
        with open(static_dir / "index.html") as fi:
            template = jinja2.Template(fi.read())
        index_rendered = template.render(page_config=config_data)
        return HTMLResponse(content=index_rendered, status_code=200)

    if profile is not None:
        logger.info(f"STATIC index: {profile}, {index_template}")
        index_rendered = get_rendered_index(config_data, profile, index_template)
        return HTMLResponse(content=index_rendered, status_code=200)
    else:
        static_dir = Path(frontend_dir)
        with open(static_dir / "index.html") as fi:
            template = jinja2.Template(fi.read())
        index_rendered = template.render(page_config=config_data)
        return HTMLResponse(content=index_rendered, status_code=200)



def load_federated_extensions(federated_extensions):
    extensions = []
    for name, data in federated_extensions.items():
        build_info = data['jupyterlab']['_build']
        build_info['name'] = name
        extensions.append(build_info)

    return extensions


def get_federated_extensions(labextensions_path):
    """Get the metadata about federated extensions"""

    federated_extensions = dict()
    for ext_dir in labextensions_path:
        # extensions are either top-level directories, or two-deep in @org directories
        dirs = chain(
            glob.iglob(pjoin(ext_dir, '[!@]*', 'package.json')),
            glob.iglob(pjoin(ext_dir, '@*', '*', 'package.json')),
        )

        for ext_path in dirs:
            with open(ext_path, encoding='utf-8') as fid:
                pkgdata = json.load(fid)

            if pkgdata['name'] not in federated_extensions:
                data = dict(
                    name=pkgdata['name'],
                    version=pkgdata['version'],
                    description=pkgdata.get('description', ''),
                    # url=get_package_url(pkgdata),
                    ext_dir=ext_dir,
                    ext_path=os.path.dirname(ext_path),
                    is_local=False,
                    dependencies=pkgdata.get('dependencies', dict()),
                    jupyterlab=pkgdata.get('jupyterlab', dict()),
                )
                install_path = pjoin(os.path.dirname(ext_path), 'install.json')
                if os.path.exists(install_path):
                    with open(install_path, encoding='utf-8') as fid:
                        data['install'] = json.load(fid)
                federated_extensions[data['name']] = data
    return federated_extensions


def register(app):
    global config_data
    # extensions = get_federated_extensions([extensions_dir])
    # federated_extensions = load_federated_extensions(extensions)

    app.include_router(mock_router, prefix="/jlabmock")
    app.include_router(catchall_router)

    extensions_dir = GLOBAL_EXTENSIONS_DIR

    logger.info(f"Configured extensions directory: {extensions_dir}")
    extensions = get_federated_extensions([extensions_dir])
    federated_extensions = load_federated_extensions(extensions)

    logger.info(f"Found federated extensions: {federated_extensions}")

    auth_registry = AuthenticatorRegistry()

    google_login_available = auth_registry.is_registered("google")
    github_login_available = auth_registry.is_registered("github")
    gitlab_login_available = auth_registry.is_registered("gitlab")

    config_data = {
        "appName": "Quetz – the fast conda package server!",
        "github_login_available": github_login_available,
        "google_login_available": google_login_available,
        "baseUrl": "/",
        "wsUrl": "",
        "appUrl": "/jlabmock",
        "labextensionsUrl": pjoin('/jlabmock/', 'extensions'),
        "themesUrl": pjoin('/jlabmock/', 'themes'),
        "settingsUrl": pjoin('/jlabmock/', 'api', 'settings'),
        "listingsUrl": pjoin('/jlabmock/', 'api', 'listings'),
        "fullAppUrl": "/jlabmock",
        "fullStaticUrl": pjoin('/jlabmock/', 'static'),
        "fullLabextensionsUrl": pjoin('/jlabmock/', 'extensions'),
        "fullThemesUrl": pjoin('/jlabmock/', 'themes'),
        "fullSettingsUrl": pjoin('/jlabmock/', 'api', 'settings'),
        "fullListingsUrl": pjoin('/jlabmock/', 'api', 'listings'),
        "federated_extensions": federated_extensions,
        "github_login_available": github_login_available,
        "gitlab_login_available": gitlab_login_available,
        "google_login_available": google_login_available,
        "cacheFiles": False,
        "devMode": False,
        "mode": "multiple-document",
        "exposeAppInBrowser": False,
        "cacheFiles": False,
        "devMode": False,
        "mode": "multiple-document",
        "exposeAppInBrowser": False,
    }

    print(config_data)

    render_index(config_data)
    frontend_dir = config.general_frontend_dir
    logger.info(f"Configured frontend found: {config.general_frontend_dir}")
