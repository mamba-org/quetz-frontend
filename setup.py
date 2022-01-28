#!/usr/bin/env python
# coding: utf-8
import os
import os.path
from os.path import join as pjoin

from setuptools import setup, find_packages

from jupyter_packaging import (
    create_cmdclass,
    combine_commands,
    install_npm,
    ensure_targets
)

NAME = 'quetz-frontend'
DESCRIPTION = 'Quetz frontend extension.'

HERE = os.path.abspath(os.path.dirname(__file__))
LOCAL_APP_DIR = os.path.join(HERE, 'quetz_frontend', 'app')
GLOBAL_APP_DIR = 'share/quetz/frontend/app'

data_files = [
    (GLOBAL_APP_DIR, LOCAL_APP_DIR, 'node_modules/**'),
    (GLOBAL_APP_DIR, LOCAL_APP_DIR, 'static/**'),
    (GLOBAL_APP_DIR, LOCAL_APP_DIR, 'themes/**'),
    (GLOBAL_APP_DIR, LOCAL_APP_DIR, 'schemas/**'),
    (GLOBAL_APP_DIR, LOCAL_APP_DIR, 'package.json'),
    (GLOBAL_APP_DIR, LOCAL_APP_DIR, 'style.js')
]

package_data = {
    NAME: [
        pjoin(LOCAL_APP_DIR, '**')
    ]
}

# Representative files that should exist after a successful build
jstargets = [
    pjoin(LOCAL_APP_DIR, 'node_modules'),
    pjoin(LOCAL_APP_DIR, 'templates'),
    pjoin(LOCAL_APP_DIR, 'static'),
    pjoin(LOCAL_APP_DIR, 'themes'),
    pjoin(LOCAL_APP_DIR, 'package.json'),
    pjoin(LOCAL_APP_DIR, 'style.js')
]

cmdclass = create_cmdclass(
    'jsdeps',
    package_data_spec=package_data,
    data_files_spec=data_files
)

cmdclass['jsdeps'] = combine_commands(
    install_npm(
        HERE,
        npm=["yarn"],
        build_cmd='build:prod'
    ),
    ensure_targets(jstargets)
)

setup_args = {
    "name": NAME,
    "version": "0.2.0",
    "description": DESCRIPTION,
    "install_requires": "quetz",
    "cmdclass": cmdclass,
    "entry_points": {
        'console_scripts': [
            'quetz-frontend = quetz_frontend.cli:app',
        ],
        'quetz.frontend': ['quetz-frontend = quetz_frontend.backend']
    },
    "packages": find_packages(),
    "include_package_data": True
}

if __name__ == '__main__':
    setup(**setup_args)
