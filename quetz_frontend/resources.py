"""Frontend Resources Getters."""

import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import List

import jinja2

from .paths import GLOBAL_FRONTEND_DIR, LOCAL_APP_DIR


logger = logging.getLogger("quetz.frontend")


@lru_cache(maxsize=1)
def get_index_template(frontend_dir: Path) -> "jinja2.Template":
    """Get the Jinja template for index.html"""
    return jinja2.Template((frontend_dir / "static" / "index.html.j2").read_text())


@lru_cache(maxsize=1)
def get_frontend_dir() -> Path:
    """Get the frontend directory."""
    if LOCAL_APP_DIR.exists():
        logger.info("Using local DEVELOPMENT frontend directory.")
        return LOCAL_APP_DIR
    elif GLOBAL_FRONTEND_DIR.exists():
        logger.info("Using global frontend directory.")
        return GLOBAL_FRONTEND_DIR
    else:
        raise RuntimeError(
            f"Could not find frontend files in:\n- {LOCAL_APP_DIR!s}\n- {GLOBAL_FRONTEND_DIR!s}"
        )


@lru_cache(maxsize=1)
def get_frontend_settings() -> dict:
    """Get the frontend settings."""

    template_path = get_frontend_dir() / "templates"
    if template_path.exists():
        # Load settings
        with (template_path / "settings.json").open() as fi:
            data = json.load(fi)
    else:
        data = []

    return Settings(data)


class Settings:
    def __init__(self, default_settings: List[dict]):
        self.__map = dict(map(lambda s: (s["id"], s), default_settings))

    def __getitem__(self, plugin: str) -> dict:
        return self.__map[plugin]

    def __setitem__(self, plugin: str, data: dict) -> None:
        if plugin not in self.__map:
            logger.error()
            self.__map[plugin] = {"id": plugin, "raw": ""}

        self.__map[plugin]["raw"] = data

    def to_json(self) -> dict:
        return {"settings": list(self.__map.values())}

