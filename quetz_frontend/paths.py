import sys
from pathlib import Path

HERE = Path(__file__).parent.resolve()
LOCAL_APP_DIR = HERE / 'app'
LOCAL_BUILD_DIR = LOCAL_APP_DIR / 'build'

GLOBAL_QUETZ_DIR = Path(sys.prefix) / 'share' / 'quetz'
GLOBAL_FRONTEND_DIR = GLOBAL_QUETZ_DIR / 'frontend'
GLOBAL_APP_DIR = GLOBAL_FRONTEND_DIR / 'app'
GLOBAL_BUILD_DIR = GLOBAL_APP_DIR / 'build'
GLOBAL_EXTENSIONS_DIR = GLOBAL_FRONTEND_DIR / 'extensions'
