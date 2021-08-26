import os
import typer
import shutil

from typing import NoReturn

from .paths import (
    LOCAL_APP_DIR,
    GLOBAL_QUETZ_DIR,
    GLOBAL_FRONTEND_DIR,
    GLOBAL_APP_DIR,
    GLOBAL_EXTENSIONS_DIR,
    JUPYTER_LAB_BUILDER
)

app = typer.Typer()

@app.command()
def install(
    dev_mode: bool = typer.Option(False, '--dev-mode', help="Whether to install it in dev mode or not")
) -> NoReturn:
    """Intall the Quetz-Frontend"""
    assert LOCAL_APP_DIR.exists()

    if not GLOBAL_FRONTEND_DIR.exists() :
        os.mkdir(GLOBAL_FRONTEND_DIR)

    if GLOBAL_APP_DIR.exists() :
        if os.path.islink(GLOBAL_APP_DIR) :
            os.remove(GLOBAL_APP_DIR)
        else:
            shutil.rmtree(GLOBAL_APP_DIR)
    
    if dev_mode :
        os.symlink(LOCAL_APP_DIR, GLOBAL_APP_DIR)
        print(f"""Symlink created:
        Ori:  {LOCAL_APP_DIR}
        Dest: {GLOBAL_APP_DIR}
        """)
    else :
        shutil.copytree(LOCAL_APP_DIR, GLOBAL_APP_DIR, symlinks = True)
        print(f"""App directory copied:
        Ori:  {LOCAL_APP_DIR}
        Dest: {GLOBAL_APP_DIR}
        """)

@app.command()
def build(
    dev_mode: bool = typer.Option(False, '--dev-mode', help="Whether to install it in dev mode or not")
) -> NoReturn:
    """Build the Quetz-Frontend"""

@app.command()
def watch() -> NoReturn:
    """Watch the Quetz-Frontend"""

@app.command()
def clean() -> NoReturn:
    """Clean the Quetz-Frontend"""
    if GLOBAL_FRONTEND_DIR.exists() :
        clean_dir(GLOBAL_FRONTEND_DIR)
    else :
        os.mkdir(GLOBAL_FRONTEND_DIR)

@app.command()
def paths() -> NoReturn:
    print(f"""
    System cofigured paths:
        Quetz:      {GLOBAL_QUETZ_DIR}
        Frontend:   {GLOBAL_FRONTEND_DIR}
        App:        {GLOBAL_APP_DIR}
        Extensions: {GLOBAL_EXTENSIONS_DIR}
        Builder:    {JUPYTER_LAB_BUILDER}
    """)

def clean_dir(dir_path):
    file_list = os.listdir(dir_path)

    for file in file_list:
        file_path = os.path.join(dir_path, file)
        
        if os.path.isfile(file_path) :
            os.remove(file_path)
        
        elif os.path.islink(file_path) :
            os.remove(file_path)

        elif os.path.isdir(file_path) :
            clean_dir(file_path)
            shutil.rmtree(file_path)

if __name__ == '__main__':
    app()