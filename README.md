![quetz header image](quetz_header.png)

# Quetz-frontend

## The Open-Source Server for Conda Packages

<table>
<thead align="center" cellspacing="10">
  <tr>
    <th colspan="3" align="center" border="">part of mamba-org</th>
  </tr>
</thead>
<tbody>
  <tr background="#FFF">
    <td align="center">Package Manager <a href="https://github.com/mamba-org/mamba">mamba</a></td>
    <td align="center">Package Server <a href="https://github.com/mamba-org/quetz">quetz</a></td>
    <td align="center">Package Builder <a href="https://github.com/mamba-org/boa">boa</a></td>
  </tr>
</tbody>
</table>

[![Github Actions Status](https://github.com/mamba-org/quetz-frontend/workflows/Build/badge.svg)](https://github.com/mamba-org/quetz-frontend/actions)

### Development

First of all, clone quetz and quetz-frontend, create a conda environment using the `environment.yml` in quetz, run quetz and modify its config file.

```bash
# Create an environment
mamba env create -f quetz/environment.yml
conda activate quetz
mamba install -c conda-forge nodejs=14 yarn
```

#### Install Quetz in dev mode

```bash
cd quetz
pip install -e .

# Run quetz
quetz run test_quetz --copy-conf ./dev_config.toml --dev --reload
```

Modify the `quetz/test_quetz/config.toml` file to add the client_id, client_secret, github username and the front-end paths.

```bash
[github]
# Register the app here: https://github.com/settings/applications/new
client_id = "id"
client_secret = "secret"

[users]
admins = ["github:username"]
```

#### Install Quetz-Frontend in dev mode

```bash
# build the app
pip install -e .

# Create a link to the quetz folder
quetz-frontend link-frontend --development
```

#### Useful commands

```bash
# Start an already configured quetz deployment in dev mode:
quetz start test_quetz --reload

# Build the Quetz-frontend
yarn run build

# Build the Quetz-Frontend in watch mode
yarn run watch
```

### Disabling extensions

```json
"quetz": {
    "extension": true,
    "outputDir": "quetz_light_theme/quetzextension",
    "themePath": "style/index.css",
    "disabledExtensions": ["quetz-theme"]
  },
```

### Command line tool

Quetz fronted also comes with a cli to manage extensions

```bash
Usage: quetz-frontend [OPTIONS] COMMAND [ARGS]...

Options:
  --install-completion  Install completion for the current shell.
  --show-completion     Show completion for the current shell, to copy it or
                        customize the installation.
  --help                Show this message and exit.

Commands:
  build           Build an extension
  clean           Clean the extensions directory
  clean-frontend  Clean the Quetz-Frontend
  develop         Build and install an extension in dev mode
  install         Build and install an extension
  link-frontend   Intall the Quetz-Frontend
  list            List of extensions
  paths
  watch           Watch an extension

```
