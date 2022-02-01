import copy
import json
import logging
import os
from functools import lru_cache
from itertools import chain
from pathlib import Path
from typing import List

import jinja2
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from quetz import authorization, rest_models
from quetz.authentication.registry import AuthenticatorRegistry
from quetz.config import Config
from quetz.dao import Dao
from quetz.deps import get_dao, get_rules, get_session

from .utils import get_extensions_dir, get_federated_extensions
from .paths import GLOBAL_FRONTEND_DIR, LOCAL_APP_DIR

logger = logging.getLogger("quetz.frontend")
config = Config()

router = APIRouter()
catchall_router = APIRouter()

ROUTE_PREFIX = "ui"

config_data = {}
index_template = None
federated_extensions = []


@lru_cache(maxsize=1)
def get_frontend_settings() -> dict:
    return {}


@lru_cache(maxsize=1)
def get_frontend_dir() -> Path:
    if LOCAL_APP_DIR.exists():
        logger.info("Using local DEVELOPMENT frontend directory.")
        return LOCAL_APP_DIR
    elif GLOBAL_FRONTEND_DIR.exists():
        logger.info("Using global frontend directory.")
        return GLOBAL_FRONTEND_DIR
    else:
        raise RuntimeException(
            f"Could not find frontend files in:\n- {LOCAL_APP_DIR!s}\n- {GLOBAL_FRONTEND_DIR!s}"
        )


@router.get("/api/settings", include_in_schema=False)
def get_settings():
    return frontend_settings


@router.get("/themes/{resource:path}", include_in_schema=False)
def get_theme(resource: str, frontend_dir: Path = Depends(get_frontend_dir)):
    path = frontend_dir / "themes" / resource
    if path.exists() and under_frontend_dir(frontend_dir, path):
        return FileResponse(path=path)
    else:
        raise HTTPException(status_code=404)


@router.get("/extensions/{resource:path}", include_in_schema=False)
def extensions(
    resource: str,
    session: dict = Depends(get_session),
    dao: Dao = Depends(get_dao),
    auth: authorization.Rules = Depends(get_rules),
    frontend_dir: Path = Depends(get_frontend_dir),
    extensions_dir: Path = Depends(get_extensions_dir),
):
    path = extensions_dir / resource
    if path.exists() and under_frontend_dir(frontend_dir, path):
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
    if path.exists() and under_frontend_dir(frontend_dir, path):
        return FileResponse(path=path)
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
        if path.exists() and under_frontend_dir(frontend_dir, path):
            return FileResponse(path=path)
        else:
            raise HTTPException(status_code=404)
    else:
        logging.warn(resource)
        extensions = get_federated_extensions([extensions_dir])
        federated_extensions = load_federated_extensions(extensions)
        config_data["federated_extensions"] = federated_extensions

        if profile:
            index_rendered = get_rendered_index(config_data, profile, index_template)
            return HTMLResponse(content=index_rendered, status_code=200)
        else:
            index_html_path = frontend_dir / "static" / "index.html"
            if not index_html_path.exists():
                render_index(frontend_dir)
            return FileResponse(path=index_html_path)


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


def get_rendered_index(config_data, profile, index_template):
    """Adds profile info to index.html"""
    cfg = copy.copy(config_data)
    cfg["logged_in_user_profile"] = rest_models.Profile.from_orm(profile).json()
    index_rendered = index_template.render(page_config=cfg)
    return index_rendered


def render_index(frontend_dir: Path):
    """Load the index.html with config and settings"""
    global index_template, frontend_settings, config_data

    if "logged_in_user_profile" in config_data:
        del config_data["logged_in_user_profile"]

    # Create index.html with config
    index_template = jinja2.Template(
        (frontend_dir / "static" / "index.html.j2").read_text()
    )
    fo = frontend_dir / "static" / "index.html"
    fo.write_text(index_template.render(page_config=config_data))

    template_path = frontend_dir / "templates"
    if template_path.exists():
        # Load settings
        with (template_path / "settings.json").open() as fi:
            frontend_settings = json.load(fi)


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

    extensions = get_federated_extensions([extensions_dir])
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

    render_index(frontend_dir)
