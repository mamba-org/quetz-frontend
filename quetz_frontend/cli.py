import typer
import subprocess
from pathlib import Path
from typing import NoReturn
from distutils.spawn import find_executable

app = typer.Typer()

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
    quetz_app_path = path.realpath(core_path)
    print(f"Frontend path: '{quetz_app_path}'")

    assert ext_path.joinpath('package.json').exists()
    extension_path = path.realpath(ext_path)
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
    development: bool = typer.Argument(False, help="Build in development"),
    source_map: bool = typer.Argument(False, help="Create source map")
) -> NoReturn:
    # TODO: get sys.path to 'etc/quetz'
    assert core_path.joinpath('package.json').exists()
    quetz_app_path = path.realpath(core_path)
    print(f"Frontend path: '{quetz_app_path}'")

    assert ext_path.joinpath('package.json').exists()
    extension_path = path.realpath(ext_path)
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

if __name__ == '__main__':
    app()