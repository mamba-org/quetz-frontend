#!/usr/bin/env python
# coding: utf-8
import os
import sys
import json
import os.path

""" from jupyter_packaging import (
    create_cmdclass, get_version,
    command_for_func, combine_commands, install_npm, run,
    skip_npm, which, log
) """

from setuptools import setup, find_packages
from setuptools.command.develop import develop

NAME = 'quetz-frontend'
DESCRIPTION = 'Quetz frontend extension.'

"""
HERE = os.path.abspath(os.path.dirname(__file__))
staging = os.path.join(HERE, NAME, 'staging')
npm = ['node', os.path.join(staging, 'yarn.js')]

data_files = [
    ('share/quetz/frontend/static', '%s/static' % NAME, '**'),
    ('share/quetz/frontend/schemas', '%s/schemas' % NAME, '**'),
    ('share/quetz/frontend/themes', '%s/themes' % NAME, '**')
]

package_data = {
    NAME: [
        'staging/*',
        'staging/templates/*',
        'static/**',
        'themes/**',
        'schemas/**',
        '*.js'
    ]
}

cmdclass = create_cmdclass(
    'jsdeps',
    data_files_spec=data_files,
    package_data_spec=package_data
)

cmdclass['jsdeps'] = combine_commands(
    install_npm(
        build_cmd='build:prod',
        path=staging,
        source_dir=staging,
        build_dir=os.path.join(HERE, NAME, 'static'),
        npm=npm
    ),
    command_for_func(check_assets)
)
"""

setup_args = {
    "name": NAME,
    "version": "0.1.0",
    "description": DESCRIPTION,
    "install_requires": "quetz",
    "entry_points": {'console_scripts': ['quetz-frontend = quetz_frontend.cli:app']},
    "packages": find_packages(),
    #"package_data": package_data,
    #"include_package_data": True,
    #"cmdclass": cmdclass
}


if __name__ == '__main__':
    setup(**setup_args)
