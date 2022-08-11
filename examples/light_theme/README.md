# Quetz Light Theme

A light theme extension for Quetz.


## Requirements

* quetz-frontend

## Install

To install the extension, execute:

```bash
pip install quetz_light_theme
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall quetz_light_theme
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

```bash
# Clone the repo to your local environment
# Change directory to the light_theme directory
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
quetz-frontend develop .
# Rebuild extension Typescript source after making changes
yarn run build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
yarn run watch
# Run Quetz in another terminal
quetz start test_quetz
```

With the watch command running, every saved change will immediately be built locally and available in your running Quetz. Refresh Quetz to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

### Development uninstall

```bash
pip uninstall light_theme
```

In development mode, you will also need to remove the symlink created by `quetz-frontend develop`
command. To find its location, you can run `quetz-frontend list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `light-theme` within that folder.

### Packaging the extension

See [RELEASE](RELEASE.md)
