import json
import logging
import os
import sys
from pathlib import Path

import jinja2
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from starlette.staticfiles import StaticFiles

from quetz import authorization, rest_models
from quetz.authentication import AuthenticatorRegistry
from quetz.config import Config, get_plugin_manager
from quetz.dao import Dao
from quetz.deps import get_dao, get_rules, get_session

pm = get_plugin_manager()

config = Config()

logger = logging.getLogger('quetz')

federated_extensions = []
for js in pm.hook.js_plugin_paths():
    federated_extensions.append(js)

mock_router = APIRouter()
catchall_router = APIRouter()

mock_settings_dict = None
frontend_dir = ""
index_template = None
config_data: dict


@mock_router.get('/api/sessions', include_in_schema=False)
def mock_sessions():
    return []