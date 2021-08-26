import sys
from os import path
from pathlib import Path

HERE = path.abspath(path.dirname(__file__))
LOCAL_APP_DIR = Path(HERE, 'app')
LOCAL_BUILD_DIR = Path(LOCAL_APP_DIR, 'build')

GLOBAL_QUETZ_DIR = Path(sys.prefix, 'share/quetz')
GLOBAL_FRONTEND_DIR = Path(GLOBAL_QUETZ_DIR, 'frontend')
GLOBAL_APP_DIR = Path(GLOBAL_FRONTEND_DIR, 'app')
GLOBAL_BUILD_DIR = Path(GLOBAL_APP_DIR, 'build')
GLOBAL_EXTENSIONS_DIR = Path(GLOBAL_FRONTEND_DIR, 'extensions')

# TOOLS
JUPYTER_LAB_BUILDER = Path(GLOBAL_APP_DIR, '/node_modules/@jupyterlab/builder/lib/build-labextension.js')