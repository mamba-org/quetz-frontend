#!/usr/bin/env python
# coding: utf-8
import os
import sys
import json
import os.path
from os.path import join as pjoin

from jupyter_packaging import (
    create_cmdclass, get_version,
    command_for_func, combine_commands, install_npm, run,
    skip_npm, which, log, ensure_targets
)

from setuptools import setup, find_packages
from setuptools.command.develop import develop

NAME = 'quetz-frontend'
DESCRIPTION = 'Quetz frontend extension.'

HERE = os.path.abspath(os.path.dirname(__file__))

app = os.path.join(HERE, 'quetz_frontend', 'app')
staging = os.path.join(HERE, 'quetz_frontend', 'app', 'build')

data_files = [
    ('share/quetz/frontend/app/', app, 'package.json'),
    ('share/quetz/frontend/app/', staging, '**')
]

package_data = {
    NAME: [
        pjoin(staging, '*'),
        pjoin(staging, 'templates/*'),
        pjoin(staging, 'static/**'),
        pjoin(staging, 'themes/**'),
        pjoin(staging, 'schemas/**'),
        pjoin(staging, '*.js')
    ]
}

# Representative files that should exist after a successful build
jstargets = [
    pjoin(staging, 'bundle.js'),
]

cmdclass = create_cmdclass('jsdeps', package_data_spec=package_data,
    data_files_spec=data_files)
js_command = combine_commands(
    install_npm(HERE, npm=["yarn"], build_cmd='build:prod'),
    ensure_targets(jstargets),
)
cmdclass['jsdeps'] = js_command


setup_args = {
    "name": NAME,
    "version": "0.2.0",
    "description": DESCRIPTION,
    "install_requires": "quetz",
    "cmdclass": cmdclass,
    "entry_points": {
        'console_scripts': [
            'quetz-frontend = quetz_frontend.cli:app',
            'quetz-frontend-extensions = quetz_frontend.extensions:app'
        ],
        'quetz.frontend': ['quetz-frontend = quetz_frontend.backend']
    },
    "packages": find_packages(),
    "include_package_data": True
}

if __name__ == '__main__':
    setup(**setup_args)
