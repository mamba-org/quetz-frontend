"""Generate the Quetz builder package from @jupyterlab/builder"""
from copy import copy
import sys
from pathlib import Path
from shutil import which, copytree, rmtree
from tempfile import TemporaryDirectory
from subprocess import check_call

from typer import Typer, Argument, echo


app = Typer()

HERE = Path(__file__).parent.resolve()
JUPYTERLAB_BUILDER_PATH = "builder"
QUETZ_BUILDER_PATH = HERE.parent / "builder"
QUETZ_BUILDER_PATCHES = HERE / "builder-patches"


@app.command()
def generate_builder(
    git_ref: str = Argument(
        ..., help="JupyterLab Git reference to use to generate Quetz builder."
    ),
    git_repository: str = Argument(
        "https://github.com/jupyterlab/jupyterlab.git",
        help="JupyterLab Git repository path.",
    ),
) -> None:
    """Generate the Quetz builder from the JupyterLab one and apply patches."""
    git_exec = which("git")

    if git_exec is None:
        echo("Git command not found; please install it.")
        sys.exit(1)

    nodejs_exec = which("node")

    if nodejs_exec is None:
        echo("NodeJS command not found; please install it.")
        sys.exit(1)

    with TemporaryDirectory() as tmpdir:
        echo(f"Cloning {git_repository} in {tmpdir}")

        check_call([git_exec, "clone", "--depth", "1", "-b", git_ref, git_repository], cwd=tmpdir)

        repo = Path(tmpdir)/ "jupyterlab"

        for patch in QUETZ_BUILDER_PATCHES.glob("*.patch"):
            check_call([git_exec, "apply", "--recount", str(patch)], cwd=str(repo))

        if QUETZ_BUILDER_PATH.exists():
            rmtree(QUETZ_BUILDER_PATH)
        QUETZ_BUILDER_PATH.parent.mkdir(parents=True, exist_ok=True)

        copytree(str(repo / JUPYTERLAB_BUILDER_PATH), QUETZ_BUILDER_PATH)


if __name__ == "__main__":
    app()
