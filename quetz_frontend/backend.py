import copy
import glob
import json
import logging
import os
import sys
from functools import lru_cache
from pathlib import Path
from typing import Optional

import jinja2
from fastapi import APIRouter, Body, Depends, Header, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from quetz import authorization, rest_models
from quetz.authentication.registry import AuthenticatorRegistry
from quetz.config import Config
from quetz.dao import Dao
from quetz.deps import get_dao, get_rules, get_session

from .utils import get_extensions_dir, get_federated_extensions
from .paths import GLOBAL_FRONTEND_DIR
from .resources import (
    Settings,
    get_frontend_dir,
    get_frontend_settings,
    get_index_template,
)

logger = logging.getLogger("quetz.frontend")
config = Config()

router = APIRouter()
catchall_router = APIRouter()

ROUTE_PREFIX = "ui"

config_data = {}
federated_extensions = []


@lru_cache(maxsize=1)
def is_dev_mode() -> bool:
    """Whether the server run in dev mode or not.

    The application is considered in dev mode if the
    ``--reload`` cli option is set.
    """
    return "--reload" in sys.argv


# Endpoint handlers


@router.get("/api/settings", include_in_schema=False)
def get_settings(frontend_settings: Settings = Depends(get_frontend_settings)):
    return frontend_settings.to_json()


@router.get("/api/settings/{extension:path}", include_in_schema=False)
def get_settings(
    extension: str, frontend_settings: Settings = Depends(get_frontend_settings)
):
    return frontend_settings[extension]


@router.put("/api/settings/{extension:path}", include_in_schema=False, status_code=204)
def put_settings(
    extension: str,
    settings: str = Body(...),
    frontend_settings: Settings = Depends(get_frontend_settings),
):
    logger.warn(settings)
    # Override the settings
    frontend_settings[extension] = json.loads(settings)["raw"]
    return {"success": True}


@router.get("/themes/{resource:path}", include_in_schema=False)
def get_theme(
    resource: str,
    frontend_dir: Path = Depends(get_frontend_dir),
    extensions_dir: Path = get_extensions_dir(),
):
    logger.warn(resource)
    path = frontend_dir / "themes" / resource
    if path.exists():
        return FileResponse(path=path)
    else:
        logger.warn(str(extensions_dir))
        # Path.glob does not follow symlinks
        for theme_extension in glob.glob(str(extensions_dir) + "/**/themes", recursive=True):
            # TODO Replace local paths with mangled paths; e.g. `url('../foo.css')`, `url('images/foo.png')`
            path = Path(theme_extension) / resource
            logger.warn(str(path))
            if path.exists():
                return FileResponse(path)

    raise HTTPException(status_code=404)


@router.get("/extensions/{resource:path}", include_in_schema=False)
def extensions(
    resource: str,
    session: dict = Depends(get_session),
    dao: Dao = Depends(get_dao),
    auth: authorization.Rules = Depends(get_rules),
    # frontend_dir: Path = Depends(get_frontend_dir),
    extensions_dir: Path = Depends(get_extensions_dir),
):
    path = extensions_dir / resource
    if path.exists():
        return FileResponse(path=path)
    else:
        raise HTTPException(status_code=404)


@router.get("/static/{resource:path}", include_in_schema=False)
def static(
    resource: str,
    session: dict = Depends(get_session),
    dao: Dao = Depends(get_dao),
    auth: authorization.Rules = Depends(get_rules),
    frontend_dir: Path = Depends(get_frontend_dir),
):
    path = frontend_dir / "static" / resource
    if path.exists():
        return FileResponse(
            path=path, headers={"cache-control": "public, max-age=604800, immutable"}
        )
    else:
        raise HTTPException(status_code=404)


@catchall_router.get("/{resource:path}", include_in_schema=False)
def index(
    resource: str,
    session: dict = Depends(get_session),
    dao: Dao = Depends(get_dao),
    auth: authorization.Rules = Depends(get_rules),
    frontend_dir: Path = Depends(get_frontend_dir),
    extensions_dir: Path = Depends(get_extensions_dir),
    cache_control: Optional[str] = Header(None),
):
    global config_data
    user_id = auth.get_user()
    profile = dao.get_profile(user_id)

    if "." in resource:
        file_name = (
            resource
            if ("icons" in resource or "logos" in resource or "page-data" in resource)
            else resource.split("/")[-1]
        )

        path = frontend_dir / "static" / file_name
        if path.exists():
            return FileResponse(path=path)
        else:
            raise HTTPException(status_code=404)
    else:
        extensions, disabled_extensions = get_federated_extensions([extensions_dir])
        federated_extensions = load_federated_extensions(extensions)
        config_data["federated_extensions"] = federated_extensions
        config_data["disabledExtensions"] = disabled_extensions

        logger.info(cache_control)
        if is_dev_mode():
            get_index_template.cache_clear()

        index_template = get_index_template(frontend_dir)
        index_rendered = get_rendered_index(config_data, profile, index_template)
        return HTMLResponse(content=index_rendered, status_code=200)


def under_frontend_dir(frontend_dir: Path, path: Path) -> bool:
    """
    Check that path is under frontend_dir
    """
    path = path.resolve()
    fdir = frontend_dir.resolve()
    globalDir = GLOBAL_FRONTEND_DIR.resolve()
    return (
        Path(os.path.commonpath([path, fdir])) == fdir
        or Path(os.path.commonpath([path, globalDir])) == globalDir
    )


def get_rendered_index(
    config_data: dict, profile: Optional["Profile"], index_template: "jinja2.Template"
) -> str:
    """Rendered the index file with user profile"""
    cfg = copy.copy(config_data)
    if profile is not None:
        cfg["logged_in_user_profile"] = rest_models.Profile.from_orm(profile).json()
    elif "logged_in_user_profile" in cfg:
        del cfg["logged_in_user_profile"]

    index_rendered = index_template.render(page_config=cfg)
    return index_rendered


def load_federated_extensions(federated_extensions: dict) -> list:
    """Load the list of extensions"""
    extensions = []
    for name, data in federated_extensions.items():
        build_info = data["quetz"]["_build"]
        build_info["name"] = name
        extensions.append(build_info)

    return extensions


def register(app):
    global config_data

    app.include_router(router, prefix=f"/{ROUTE_PREFIX}")
    app.include_router(catchall_router)

    # frontend_dir = config.general_frontend_dir
    # extensions_dir = config.general_extensions_dir
    frontend_dir = get_frontend_dir()
    extensions_dir = get_extensions_dir()

    logger.info(f"Configured frontend found: {frontend_dir!s}")
    logger.info(f"Configured extensions directory: {extensions_dir!s}")

    extensions, disabled_extensions = get_federated_extensions([extensions_dir])
    federated_extensions = load_federated_extensions(extensions)

    auth_registry = AuthenticatorRegistry()
    google_login_available = auth_registry.is_registered("google")
    github_login_available = auth_registry.is_registered("github")
    gitlab_login_available = auth_registry.is_registered("gitlab")
    azuread_login_available = auth_registry.is_registered("azuread")

    config_data = {
        "appName": "Quetz – the fast conda package server!",
        "baseUrl": "/",
        "wsUrl": "",
        "appUrl": f"/{ROUTE_PREFIX}",
        "labextensionsUrl": f"/{ROUTE_PREFIX}/extensions",
        "themesUrl": f"/{ROUTE_PREFIX}/themes",
        "settingsUrl": f"/{ROUTE_PREFIX}/api/settings",
        "listingsUrl": "",
        "fullAppUrl": f"/{ROUTE_PREFIX}",
        "fullStaticUrl": f"/{ROUTE_PREFIX}/static",
        "fullQuetzextensionsUrl": f"/{ROUTE_PREFIX}/extensions",
        "fullThemesUrl": f"/{ROUTE_PREFIX}/themes",
        "fullSettingsUrl": f"/{ROUTE_PREFIX}/api/settings",
        "fullListingsUrl": "",
        "federated_extensions": federated_extensions,
        "disabledExtensions": disabled_extensions,
        "github_login_available": github_login_available,
        "gitlab_login_available": gitlab_login_available,
        "google_login_available": google_login_available,
        "azuread_login_available": azuread_login_available,
        "cacheFiles": False,
        "devMode": False,
        "mode": "multiple-document",
        "exposeAppInBrowser": False,
        "cacheFiles": False,
        "devMode": False,
        "mode": "multiple-document",
        "exposeAppInBrowser": False,
    }
