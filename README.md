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

[general]
frontend_dir = "/path/to/quetz/frontend/quetz_frontend/app/build"
extensions_dir = "path/to/extensions/folder"
```

#### Install Quetz-Frontend in dev mode
```bash
# build the app
pip install -e .
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

There is also a watch command to automatically rebuild the application when there are new changes:
