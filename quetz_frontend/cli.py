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
    core_path: str = typer.Argument(None, help="The path of the frontend app"),
    ext_path: str = typer.Argument('.', help="The path of the extension")
) -> NoReturn:
    """Build an extension"""

    quetz_app_path = Path(core_path).absolute()
    print(f"Frontend path: '{quetz_app_path}'")
    assert (quetz_app_path / "package.json").exists()

    extension_path = Path(ext_path).absolute()
    print(f"Extension path: '{extension_path}'")
    assert (extension_path / "package.json").exists()

    exe = 'node'
    exe_path = find_executable(exe)

    if not exe_path:
        print(f"Could not find {exe}. Install NodeJS.")
        exit(1)
    
    command = [
        exe,
        'node_modules/@jupyterlab/builder/lib/build-labextension.js',
        '--core-path',
        core_path,
        '--development',
        '--source-map',
        ext_path
    ]
    subprocess.check_call(command)

if __name__ == '__main__':
    app()