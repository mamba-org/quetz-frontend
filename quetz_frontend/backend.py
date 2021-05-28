import os
import sys
import json
import glob
import copy
import logging
from os.path import join as pjoin

import jinja2
from itertools import chain

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, HTMLResponse

from quetz.dao import Dao
from quetz.config import Config
from quetz.deps import get_dao, get_rules, get_session
from quetz.authentication.registry import AuthenticatorRegistry
from quetz import authorization, rest_models


logger = logging.getLogger('quetz.frontend')
config = Config()

mock_router = APIRouter()
catchall_router = APIRouter()

config_data = {}
index_template = None
frontend_settings = {}
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

@mock_router.get('/api/sessions', include_in_schema=False)
def mock_sessions():
    return []

@mock_router.get('/api/kernels', include_in_schema=False)
def mock_kernels():
    return []

@mock_router.get('/api/kernelspecs', include_in_schema=False)
def mock_kernelspecs():
    return []

@mock_router.get('/api/settings', include_in_schema=False)
def mock_settings():
    return frontend_settings

@mock_router.get('/themes/{resource:path}', include_in_schema=False)
def get_theme(resource: str):
    path = pjoin(frontend_dir, 'themes', resource)
    if os.path.exists(path) and under_frontend_dir(path):
        return FileResponse(path=path)
    else:
        raise HTTPException(status_code=404)

@mock_router.get('/extensions/{resource:path}', include_in_schema=False)
def extensions(
    resource: str,
    session: dict = Depends(get_session),
    dao: Dao = Depends(get_dao),
    auth: authorization.Rules = Depends(get_rules),
):
    path = pjoin(extensions_dir, resource)
    if os.path.exists(path) and under_frontend_dir(path):
        return FileResponse(path=path)
    else:
        raise HTTPException(status_code=404)

@mock_router.get('/static/{resource:path}', include_in_schema=False)
def static(
    resource: str,
    session: dict = Depends(get_session),
    dao: Dao = Depends(get_dao),
    auth: authorization.Rules = Depends(get_rules),
):
    path = pjoin(frontend_dir, resource)
    if os.path.exists(path) and under_frontend_dir(path):
        return FileResponse(path=path)
    else:
        raise HTTPException(status_code=404)

@catchall_router.get('/{resource:path}', include_in_schema=False)
def index(
    resource: str,
    session: dict = Depends(get_session),
    dao: Dao = Depends(get_dao),
    auth: authorization.Rules = Depends(get_rules),
):
    user_id = auth.get_user()
    profile = dao.get_profile(user_id)

    if '.' in resource :
        file_name = (
            resource
            if ('icons' in resource or 'logos' in resource or 'page-data' in resource)
            else resource.split('/')[-1]
        )

        path = pjoin(frontend_dir, file_name)
        if os.path.exists(path) and under_frontend_dir(path) :
            return FileResponse(path=path)
        else:
            return HTTPException(status_code=404)
    else:
        if profile :
            index_rendered = get_rendered_index(config_data, profile, index_template)
            return HTMLResponse(content=index_rendered, status_code=200)
        else:
            index_html_path = pjoin(frontend_dir, "index.html")
            if not os.path.exists(index_html_path):
                render_index()
            return FileResponse(path=pjoin(frontend_dir, "index.html"))

def under_frontend_dir(path):
    """
    Check that path is under frontend_dir

    NOTE: os.path.abspath may seem unnecessary, but os.path.commonpath does not
    appear to handle relative paths as you would expect.
    """
    path = os.path.abspath(path)
    fdir = os.path.abspath(frontend_dir)
    return os.path.commonpath([path, fdir]) == fdir


def get_rendered_index(config_data, profile, index_template):
    """Adds profile info to index.html"""
    cfg = copy.copy(config_data)
    cfg["logged_in_user_profile"] = rest_models.Profile.from_orm(profile).json()
    index_rendered = index_template.render(page_config=cfg)
    return index_rendered

def render_index():
    """Load the index.html with config and settings"""
    global index_template, frontend_settings, config_data

    if "logged_in_user_profile" in config_data:
        del cfg["logged_in_user_profile"]

    # Create index.html with config
    with open(pjoin(frontend_dir, "index.html.j2")) as fi:
        index_template = jinja2.Template(fi.read())
    with open(pjoin(frontend_dir, "index.html"), "w") as fo:
        fo.write(index_template.render(page_config=config_data))

    template_path = pjoin(frontend_dir, "..", "templates")
    if os.path.exists(template_path):
        # Load settings
        with open(pjoin(template_path, "settings.json")) as fi:
            frontend_settings = json.load(fi)

def load_federated_extensions(federated_extensions):
    """Load the list of extensions"""
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

    app.include_router(mock_router, prefix="/jlabmock")
    app.include_router(catchall_router)

    frontend_dir = config.general_frontend_dir
    extensions_dir = GLOBAL_EXTENSIONS_DIR

    logger.info(f"Configured frontend found: {frontend_dir}")
    logger.info(f"Configured extensions directory: {extensions_dir}")

    extensions = get_federated_extensions([extensions_dir])
    federated_extensions = load_federated_extensions(extensions)

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

    render_index()
    