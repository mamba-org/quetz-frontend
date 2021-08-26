import os
import typer
import shutil
import importlib
import subprocess

import os.path as osp
from pathlib import Path
from typing import NoReturn
from setuptools import find_packages
from distutils.spawn import find_executable

from .paths import (
    GLOBAL_APP_DIR,
    GLOBAL_EXTENSIONS_DIR,
    JUPYTER_LAB_BUILDER
)

app = typer.Typer()

# node ./node_modules/@jupyterlab/builder/lib/build-labextension.js ext_path
# '--core-path core_path' '--static-url static_url' '--development' '--source-map'
# '--watch' '--development' '--source-map'

@app.command()
def install(
    ext_path: str = typer.Argument(Path(), help="The path of the extension")
) -> NoReturn:
    """Build and install an extension"""

    assert ext_path.joinpath('package.json').exists()
    extension_path = osp.realpath(ext_path)
    print(f"Extension path: '{extension_path}'")

    build_extension(ext_path, False, False)

    extension_path = Path(ext_path)
    assert extension_path.exists()
    extension_path = osp.realpath(extension_path)
    print(f"Extension path: '{extension_path}'")

    module, metadata = get_extensions_metadata(extension_path)
    print(module.__name__, metadata)
    src = Path(extension_path).joinpath(module.__name__, metadata[0]['src'])
    dest = GLOBAL_EXTENSIONS_DIR.joinpath(metadata[0]['dest'])
    if dest.exists() :
        os.remove(dest)
    
    print(f"Path: '{src}', '{dest}'")
    shutil.copytree(src, dest, symlinks = True)

@app.command()
def develop(
    ext_path: str = typer.Argument(Path(), help="The path of the extension")
) -> NoReturn:
    """Build and install an extension in dev mode"""

    assert GLOBAL_EXTENSIONS_DIR.exists()
    print(f"Extensions dir: '{GLOBAL_EXTENSIONS_DIR}'")

    assert ext_path.joinpath('package.json').exists()
    extension_path = osp.realpath(ext_path)
    print(f"Extension path: '{extension_path}'")

    module, metadata = get_extensions_metadata(extension_path)
    print(module.__name__, metadata)
    src = Path(extension_path).joinpath(module.__name__, metadata[0]['src'])
    dest = GLOBAL_EXTENSIONS_DIR.joinpath(metadata[0]['dest'])
    if dest.exists() :
        os.remove(dest)
    
    print(f"symlink link: '{src}', '{dest}'")
    os.symlink(src, dest)

    build_extension(ext_path, True, False)
    
@app.command()
def build(
    ext_path: str = typer.Argument(Path(), help="The path of the extension"),
    dev_mode: bool = typer.Option(False, '--dev-mode', help="Build in development")
) -> NoReturn:
    """Build an extension"""

    assert ext_path.joinpath('package.json').exists()
    extension_path = osp.realpath(ext_path)
    print(f"Extension path: '{extension_path}'")

    build_extension(ext_path, dev_mode, False)

@app.command()
def watch(
    ext_path: str = typer.Argument(Path(), help="The path of the extension")
) -> NoReturn:
    """Watch an extension"""

    assert ext_path.joinpath('package.json').exists()
    extension_path = osp.realpath(ext_path)
    print(f"Extension path: '{extension_path}'")

    build_extension(ext_path, True, True)

def build_extension(ext_path, dev_mode=False, watch=False):
    assert GLOBAL_APP_DIR.joinpath('package.json').exists()
    print(f"Frontend path: '{GLOBAL_APP_DIR}'")

    assert JUPYTER_LAB_BUILDER.exists()
    print(f"Builder path: '{JUPYTER_LAB_BUILDER}'")

    exe = 'node'
    exe_path = find_executable(exe)

    if not exe_path:
        print(f"Could not find {exe}. Install NodeJS.")
        exit(1)
    
    command = [
        exe,
        JUPYTER_LAB_BUILDER,
        '--core-path',
        GLOBAL_APP_DIR
    ]

    if dev_mode :
        command.append('--development')
        command.append('--source-map')
    
    if watch :
        command.append('--watch')
        
    command.append(ext_path)

    subprocess.check_call(command)

def get_extensions_metadata(module_path):
    mod_path = osp.abspath(module_path)
    if not osp.exists(mod_path):
        raise FileNotFoundError('The path `{}` does not exist.'.format(mod_path))

    # TODO: Change function name to match lab
    try:
        module = importlib.import_module(module_path)
        if hasattr(module, 'js_plugin_paths') :
            return module, module.js_plugin_paths()
        else :
            module = None
    except Exception:
        module = None

    # Looking for modules in the package
    packages = find_packages(mod_path)
    for package in packages :
        try:
            module = importlib.import_module(package)
            if hasattr(module, 'js_plugin_paths') :
                return module, module.js_plugin_paths()
        except Exception:
            module = None          
            
    raise ModuleNotFoundError('There is not a extension at {}'.format(module_path))

if __name__ == '__main__':
    app()