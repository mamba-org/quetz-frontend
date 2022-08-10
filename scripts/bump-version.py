#############################################################################
# Copyright (c) 2018, Voila Contributors                                    #
# Copyright (c) 2018, QuantStack                                            #
#                                                                           #
# Distributed under the terms of the BSD 3-Clause License.                  #
#                                                                           #
# The full license is in the file LICENSE, distributed with this software.  #
#############################################################################

import json
import click
from pathlib import Path
from jupyter_releaser.util import get_version, run
from pkg_resources import parse_version

LERNA_CMD = "yarn run lerna version --no-push --no-changelog --force-publish --no-git-tag-version"

@click.command()
@click.option("--force", default=False, is_flag=True)
@click.argument("spec", nargs=1)
def bump(force, spec):
    status = run("git status --porcelain").strip()
    if len(status) > 0:
        raise Exception("Must be in a clean git state with no untracked files")

    curr = parse_version(get_version())
    if spec == 'next':
        spec = f"{curr.major}.{curr.minor}."
        if curr.pre:
            p, x = curr.pre
            spec += f"{curr.micro}{p}{x + 1}"
        else:
            spec += f"{curr.micro + 1}"
    
    elif spec == 'patch':
        spec = f"{curr.major}.{curr.minor}."
        if curr.pre:
            spec += f"{curr.micro}"
        else:
            spec += f"{curr.micro + 1}"


    version = parse_version(spec)

    # convert the Python version
    js_version = f"{version.major}.{version.minor}.{version.micro}"
    if version.pre:
        p, x = version.pre
        p = p.replace("a", "alpha").replace("b", "beta")
        js_version += f"-{p}.{x}"

    # bump the JS packages
    lerna_cmd = f"{LERNA_CMD} {js_version}"
    if force:
        lerna_cmd += " --yes"
    run(lerna_cmd)
    # update the resolutions in the app package.json
    _update_resolutions("@quetz-frontend", "~{}".format(js_version))

def _update_resolutions(package, version):
    """
        Update the resolutions' version of the app package.json
        
        package: prefix of the packages to update.
                    Example: '@quetz-fronted'
        version: new version for the packages
                    Example: '~0.3.2'
    """
    HERE = Path(__file__).parent.parent.resolve()
    file_path = (HERE / "quetz_frontend" / "app" / "package.json")

    if not file_path.exists() :
        raise FileNotFoundError(f"Could not find package.json under dir {file_path!s}")

    try:
        with file_path.open('r') as f:
            pkg_json = json.load(f)
        
        resolutions = pkg_json["resolutions"]
        for pkg in resolutions:
            if package in pkg:
                resolutions[pkg] = version
        
        pkg_json["resolutions"] = resolutions
        with file_path.open('w') as f:
            json.dump(pkg_json, f, indent=2)

    except FileNotFoundError:
        pass


if __name__ == "__main__":
    bump()
