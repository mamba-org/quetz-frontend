from pathlib import Path
from setuptools import setup

HERE = Path(__file__).parent.resolve()
LOCAL_APP_DIR = HERE / "quetz_frontend" / "app"
GLOBAL_APP_DIR = "share/quetz/frontend/app"

data_files_spec = [
    (GLOBAL_APP_DIR, str(LOCAL_APP_DIR), "static/**"),
    (GLOBAL_APP_DIR, str(LOCAL_APP_DIR), "themes/**"),
    (GLOBAL_APP_DIR, str(LOCAL_APP_DIR), "schemas/**")
]

# Representative files that should exist after a successful build
ensured_targets = [
    str(LOCAL_APP_DIR / "templates"),
    str(LOCAL_APP_DIR / "static"),
    str(LOCAL_APP_DIR / "themes"),
    str(LOCAL_APP_DIR / "static" / "package.json"),
    str(LOCAL_APP_DIR / "static" / "style.js"),
]

try:
    from jupyter_packaging import wrap_installers, npm_builder, get_data_files

    builder = npm_builder(build_cmd="build:prod", npm=["yarn"])
    cmdclass = wrap_installers(post_develop=builder, ensured_targets=ensured_targets)

    setup_args = {"cmdclass": cmdclass, "data_files": get_data_files(data_files_spec)}
except ImportError:
    setup_args = dict()

if __name__ == "__main__":
    setup(**setup_args)
