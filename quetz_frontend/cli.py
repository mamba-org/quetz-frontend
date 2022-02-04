import importlib
import json
import os
import shutil
import subprocess
from pathlib import Path
from shutil import which
from typing import List, Optional, Tuple

from setuptools import find_packages
from typer import Argument, Option, Typer

from .paths import (
    GLOBAL_APP_DIR,
    GLOBAL_EXTENSIONS_DIR,
    GLOBAL_FRONTEND_DIR,
    GLOBAL_QUETZ_DIR,
    LOCAL_APP_DIR,
)
from .utils import clean_dir, get_extensions_dir, get_federated_extensions

app = Typer()


@app.command()
def link_frontend(
    dev_mode: bool = Option(
        False, "--development", help="Whether to install it in dev mode or not"
    )
) -> None:
    """Intall the Quetz-Frontend"""
    assert LOCAL_APP_DIR.exists()

    if not GLOBAL_FRONTEND_DIR.exists():
        GLOBAL_FRONTEND_DIR.mkdir(parents=True, exist_ok=True)

    if GLOBAL_APP_DIR.exists():
        if GLOBAL_APP_DIR.is_symlink():
            GLOBAL_APP_DIR.unlink()
        else:
            shutil.rmtree(GLOBAL_APP_DIR)

    if dev_mode:
        GLOBAL_APP_DIR.symlink_to(LOCAL_APP_DIR)
        print(
            f"""Symlink created:
        Ori:  {LOCAL_APP_DIR}
        Dest: {GLOBAL_APP_DIR}
        """
        )
    else:
        shutil.copytree(LOCAL_APP_DIR, GLOBAL_APP_DIR, symlinks=True)
        print(
            f"""App directory copied:
        Ori:  {LOCAL_APP_DIR}
        Dest: {GLOBAL_APP_DIR}
        """
        )


@app.command()
def clean_frontend() -> None:
    """Clean the Quetz-Frontend"""

    if GLOBAL_APP_DIR.is_file() or GLOBAL_APP_DIR.is_symlink():
        GLOBAL_APP_DIR.unlink()
    elif GLOBAL_APP_DIR.is_dir():
        shutil.rmtree(GLOBAL_APP_DIR)


@app.command()
def install(ext_path: str = Argument(Path(), help="The path of the extension")) -> None:
    """Build and install an extension"""

    if not GLOBAL_EXTENSIONS_DIR.exists():
        os.mkdir(GLOBAL_EXTENSIONS_DIR)

    extension_path = Path(ext_path).resolve()
    assert extension_path.joinpath("package.json").exists()

    _build_extension(ext_path, True, False)

    module, metadata = _get_extensions_metadata(extension_path)
    src = Path(extension_path).joinpath(module.__name__, metadata[0]["src"])
    dest = GLOBAL_EXTENSIONS_DIR.joinpath(metadata[0]["dest"])

    clean_dir(dest)

    shutil.copytree(src, dest, symlinks=True)
    print(
        f"""
    Extension installed:
        Path:  {dest}
    """
    )


@app.command()
def develop(ext_path: str = Argument(Path(), help="The path of the extension")) -> None:
    """Build and install an extension in dev mode"""

    if not GLOBAL_EXTENSIONS_DIR.exists():
        os.mkdir(GLOBAL_EXTENSIONS_DIR)

    extension_path = Path(ext_path).resolve()
    assert extension_path.joinpath("package.json").exists()

    _build_extension(extension_path, True, False)

    _develop_extension(extension_path)


@app.command()
def build(
    ext_path: str = Argument(Path(), help="The path of the extension"),
    dev_mode: bool = Option(False, "--development", help="Build in development"),
) -> None:
    """Build an extension"""

    if not GLOBAL_EXTENSIONS_DIR.exists():
        os.mkdir(GLOBAL_EXTENSIONS_DIR)

    extension_path = Path(ext_path).resolve()
    assert extension_path.joinpath("package.json").exists()

    _build_extension(extension_path, dev_mode, False)


@app.command()
def watch(ext_path: str = Argument(Path(), help="The path of the extension")) -> None:
    """Watch an extension"""

    if not GLOBAL_EXTENSIONS_DIR.exists():
        os.mkdir(GLOBAL_EXTENSIONS_DIR)

    extension_path = Path(ext_path).resolve()
    assert extension_path.joinpath("package.json").exists()

    _develop_extension(extension_path)
    _build_extension(extension_path, True, True)


@app.command()
def uninstall(ext_name: str = Argument("", help="The name of the extension")) -> None:
    """Uninstall an extension"""

    if not GLOBAL_EXTENSIONS_DIR.exists():
        os.mkdir(GLOBAL_EXTENSIONS_DIR)

    extension_path = Path(GLOBAL_EXTENSIONS_DIR, ext_name)
    clean_dir(extension_path)


@app.command()
def list() -> None:
    """List of extensions"""

    print(f"Installed extensions:")
    print(f"---------------------")
    print(f"  Installation path: '{GLOBAL_EXTENSIONS_DIR}'\n")

    extensions, disabled_extensions = get_federated_extensions([get_extensions_dir()])

    if not extensions:
        print("No installed extensions yet")
    
    for ext in extensions.values():
        print(f'\t-  {Path(ext["ext_path"]).relative_to(GLOBAL_EXTENSIONS_DIR)}')
    
    print(f"Disabled extensions:")
    print(f"---------------------")
    for ext in disabled_extensions:
        print(f'\t-  {ext}')

    print()


@app.command()
def clean() -> None:
    """Clean the extensions directory"""
    if GLOBAL_EXTENSIONS_DIR.exists():
        shutil.rmtree(GLOBAL_EXTENSIONS_DIR)


@app.command()
def paths() -> None:
    """Quetz installation paths"""

    print(
        f"""
    System cofigured paths:
        Quetz:      {GLOBAL_QUETZ_DIR}
        Frontend:   {GLOBAL_FRONTEND_DIR}
        App:        {GLOBAL_APP_DIR}
        Extensions: {GLOBAL_EXTENSIONS_DIR}
    """
    )


def _develop_extension(ext_path: Path):
    with (ext_path / "package.json").open(encoding="utf-8") as fid:
        ext_data = json.load(fid)

    _, metadata = _get_extensions_metadata(ext_path)
    src = ext_path / ext_data["quetz"].get("outputDir", metadata[0]["src"])
    dest = GLOBAL_EXTENSIONS_DIR.joinpath(ext_data["name"])

    clean_dir(dest)

    # Create parent directory if extension name is scoped
    dest.parent.mkdir(parents=True, exist_ok=True)

    dest.symlink_to(src)
    print(
        f"""
    Symlink created:
        Ori:  {src!s}
        Dest: {dest!s}
    """
    )


def _build_extension(ext_path: Path, dev_mode: bool = False, watch: bool = False):
    if not GLOBAL_APP_DIR.joinpath("package.json").exists():
        print(f"Quetz frontend not fount at '{GLOBAL_APP_DIR!s}'")

    builder_path = _find_builder(ext_path)
    if builder_path is None:
        print(f"Could not find @quetz-frontend/builder at {ext_path!s}")
        print(f"Extensions require a devDependency '@quetz-frontend/builder'")
        return

    exe = "node"
    exe_path = which(exe)

    if not exe_path:
        print(f"Could not find {exe}. Install NodeJS.")
        exit(1)

    command = [exe, str(builder_path), "--core-path", str(GLOBAL_APP_DIR.resolve())]

    if dev_mode:
        command.append("--development")
        command.append("--source-map")

    if watch:
        command.append("--watch")

    command.append(str(ext_path))

    print("Building extension")
    subprocess.check_call(command)


def _find_builder(ext_path: Path) -> Optional[Path]:
    """Find the package '@quetz-frontend/builder' in the extension dependencies"""

    with (ext_path / "package.json").open(encoding="utf-8") as fid:
        ext_data = json.load(fid)

    depVersion2 = ext_data.get("devDependencies", dict()).get("@quetz-frontend/builder")
    depVersion2 = depVersion2 or ext_data.get("dependencies", dict()).get(
        "@quetz-frontend/builder"
    )
    if depVersion2 is None:
        return None

    # Find @quetz-frontend/builder in the node_modules directory
    target = ext_path
    while not (target / "node_modules" / "@quetz-frontend" / "builder").exists():
        if target.parent == target:
            return None
        target = target.parent

    return (
        target
        / "node_modules"
        / "@quetz-frontend"
        / "builder"
        / "lib"
        / "build-quetzextension.js"
    )


def _get_extensions_metadata(
    module_path: Path,
) -> Tuple["importlib.ModuleType", List[str]]:
    mod_path = module_path.resolve()
    if not mod_path.exists():
        raise FileNotFoundError(f"The path `{mod_path!s}` does not exist.")

    # TODO: Change function name to match lab
    try:
        module = importlib.import_module(str(module_path))
        if hasattr(module, "js_plugin_paths"):
            return module, module.js_plugin_paths()
        else:
            module = None
    except Exception:
        module = None

    # Looking for modules in the package
    packages = find_packages(str(mod_path))
    for package in packages:
        try:
            module = importlib.import_module(package)
            if hasattr(module, "js_plugin_paths"):
                return module, module.js_plugin_paths()
        except Exception:
            module = None

    raise ModuleNotFoundError(f"There is not a extension at {module_path}")


if __name__ == "__main__":
    app()
