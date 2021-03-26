import logging
import os
import sys
import subprocess
from pathlib import Path
from distutils.spawn import find_executable

from quetz.config import Config

config = Config()

logger = logging.getLogger('quetz')

frontend_dir = f"{sys.prefix}/share/quetz/frontend/"

def install(path):
    abs_path = Path(path).absolute()
    print(f"Frontend path: '{abs_path}'")
    assert (abs_path / "package.json").exists()

    exes = ['yarn', 'npm']
    if (abs_path / "requirements.txt").exists():
        exe_path = None
        for exe in exes:
            exe_path = find_executable(exe)
            if exe_path:
                break

        if not exe_path:
            print(
                f"""Could not find any of {exes}.
                Needed to install the plugin requirements."""
            )
            exit(1)
        
        subprocess.check_call([exe, 'install'], cwd=path)


def check_installation_path():
    if hasattr(config, 'general_frontend_dir') and config.general_frontend_dir:
        frontend_dir = config.general_frontend_dir
        logger.info(f"Configured frontend in: {frontend_dir}")
    else :
        logger.info(f"Default frontend dir in: {frontend_dir}")

    if os.path.isdir(frontend_dir) :
        os.rmdir(frontend_dir)
        logger.info("Removed frontend installation found")
    
    os.makedirs(frontend_dir)
    logger.info("Created new frontend installation folder")
            