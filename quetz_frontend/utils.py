import json
import logging
import shutil
from functools import lru_cache
from itertools import chain
from pathlib import Path
from typing import List

from .paths import GLOBAL_EXTENSIONS_DIR

logger = logging.getLogger("quetz.frontend")


def clean_dir(dir_path: Path) -> None:
    """Clean a directory"""

    if dir_path.is_file() or dir_path.is_symlink():
        dir_path.unlink()

    elif dir_path.is_dir():
        shutil.rmtree(str(dir_path))


@lru_cache(maxsize=1)
def get_extensions_dir() -> Path:
    if not GLOBAL_EXTENSIONS_DIR.exists():
        GLOBAL_EXTENSIONS_DIR.mkdir(parents=True, exist_ok=True)
        logger.info("Creating a global frontend extensions directory.")

    return GLOBAL_EXTENSIONS_DIR

def get_package_url(data):
    """Get the url from the extension data
    """
    # homepage, repository  are optional
    if 'homepage' in data:
        url = data['homepage']
    elif 'repository' in data and isinstance(data['repository'], dict):
        url = data['repository'].get('url', '')
    else:
        url = ''
    return url

def get_federated_extensions(quetzextensions_path: List[Path]) -> dict:
    """Get the metadata about federated extensions"""

    # Internal getter to apply lru_cache as it does not support list argument
    @lru_cache
    def get_metadata(ext_dir: Path) -> list:
        datas = []

        # extensions are either top-level directories, or two-deep in @org directories
        dirs = chain(
            ext_dir.glob("[!@]*/package.json"),
            ext_dir.glob("@*/*/package.json"),
        )

        for ext_path in dirs:
            with ext_path.open(encoding="utf-8") as fid:
                pkgdata = json.load(fid)

            if pkgdata["name"] not in federated_extensions:
                data = dict(
                    name=pkgdata["name"],
                    version=pkgdata["version"],
                    description=pkgdata.get("description", ""),
                    url=get_package_url(pkgdata),
                    ext_dir=str(ext_dir),
                    ext_path=str(ext_path.parent),
                    is_local=False,
                    dependencies=pkgdata.get("dependencies", dict()),
                    quetz=pkgdata.get("quetz", dict()),
                )
                install_path = ext_path.parent / "install.json"
                if install_path.exists():
                    with install_path.open(encoding="utf-8") as fid:
                        data["install"] = json.load(fid)

                # Check if this extension disables another extension
                for disabled in data['quetz'].get('disabledExtensions', []):
                    if disabled not in disabled_extensions:
                        disabled_extensions.append(disabled)
                
                datas.append(data)

        return datas

    federated_extensions = dict()
    disabled_extensions = []
    for ext_dir in quetzextensions_path:
        datas = get_metadata(ext_dir)
        for data in datas:
            federated_extensions[data["name"]] = data

    return (federated_extensions, disabled_extensions)
