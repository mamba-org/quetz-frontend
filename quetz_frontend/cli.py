import os
import sys
import typer
import importlib
import subprocess

import os.path as osp
from pathlib import Path
from typing import NoReturn
from setuptools import find_packages
from distutils.spawn import find_executable

app = typer.Typer()

GLOBAL_EXTENSIONS_DIR = Path(sys.prefix).joinpath('/share/quetz/frontend/extensions/')

# node ./node_modules/@jupyterlab/builder/lib/build-labextension.js ext_path
# '--core-path core_path' '--static-url static_url' '--development' '--source-map'
# '--watch' '--development' '--source-map'

@app.command()
def build(
    core_path: str = typer.Argument(Path(__file__).parent.joinpath('app'), help="The path of the frontend app"),
    ext_path: str = typer.Argument(Path(), help="The path of the extension"),
    development: bool = typer.Argument(False, help="Build in development"),
    source_map: bool = typer.Argument(False, help="Create source map")
) -> NoReturn:
    """Build an extension"""
    # TODO: get sys.path to 'etc/quetz'
    assert core_path.joinpath('package.json').exists()
    quetz_app_path = osp.realpath(core_path)
    print(f"Frontend path: '{quetz_app_path}'")

    assert ext_path.joinpath('package.json').exists()
    extension_path = osp.realpath(ext_path)
    print(f"Extension path: '{extension_path}'")

    exe = 'node'
    exe_path = find_executable(exe)

    if not exe_path:
        print(f"Could not find {exe}. Install NodeJS.")
        exit(1)
    
    command = [
        exe,
        'node_modules/@jupyterlab/builder/lib/build-labextension.js',
        '--core-path',
        core_path
    ]
    if development :
        command.append('--development')
    if source_map :
        command.append('--source-map')
    command.append(ext_path)

    subprocess.check_call(command)

@app.command()
def develop(
    core_path: str = typer.Argument(Path(__file__).parent.joinpath('app'), help="The path of the frontend app"),
    ext_path: str = typer.Argument(Path(), help="The path of the extension"),
    development: bool = typer.Argument(True, help="Build in development"),
    source_map: bool = typer.Argument(True, help="Create source map")
) -> NoReturn:
    # TODO: get sys.path to 'etc/quetz'
    assert core_path.joinpath('package.json').exists()
    quetz_app_path = osp.realpath(core_path)
    print(f"Frontend path: '{quetz_app_path}'")

    assert ext_path.joinpath('package.json').exists()
    extension_path = osp.realpath(ext_path)
    print(f"Extension path: '{extension_path}'")

    module, metadata = get_extensions_metadata(extension_path)
    print(module.__name__, metadata)
    src = Path(extension_path).joinpath(module.__name__, metadata[0]['src'])
    dest = GLOBAL_EXTENSIONS_DIR.joinpath(metadata[0]['dest'])
    if dest.exists() :
        os.remove(dest)
    
    print(f"Simbolyc link: '{src}', '{dest}'")
    os.symlink(src, dest)

    exe = 'node'
    exe_path = find_executable(exe)

    if not exe_path:
        print(f"Could not find {exe}. Install NodeJS.")
        exit(1)
    
    command = [
        exe,
        'node_modules/@jupyterlab/builder/lib/build-labextension.js',
        '--core-path',
        core_path
    ]
    if development :
        command.append('--development')
    if source_map :
        command.append('--source-map')
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