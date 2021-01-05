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

```bash
# after installing quetz activate quetz environment
conda activate quetz

# install the dependencies
yarn

# build the app
yarn run build
```

There is also a watch command to automatically rebuild the application when there are new changes:

```bash
yarn run watch
```

Remember to add the path to the frontend build folder in the quetz `config.toml` file and add your github user as an admin.
```bash
[users]
admins = ["github username"]

[general]
frontend_dir = "/path/to/quetz-frontend/build/"
```