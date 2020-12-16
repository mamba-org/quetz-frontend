export const getChannels = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            name: 'test',
            description: 'The test channel!',
            private: false,
            size_limit: null,
            mirror_channel_url: null,
            mirror_mode: null
          },
          {
            name: 'robostack',
            description: 'The robostack channel!',
            private: false,
            size_limit: null,
            mirror_channel_url: 'https://conda.anaconda.org/robostack/',
            mirror_mode: 'mirror'
          },
          {
            name: 'conda-forge',
            description: 'The conda-forge mirror',
            private: false,
            size_limit: null,
            mirror_channel_url: 'https://conda.anaconda.org/conda-forge',
            mirror_mode: 'mirror'
          }
        ]
      });
    }, 1000);
  });

export const getPackages = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: [{"name":"begins","summary":"Command line programs for busy developers","description":"n/a"},{"name":"cmrt","summary":"Media GPU kernel manager for Intel G45 & HD Graphics family","description":"One solution to expose Intel’s Gen GPU’s high performance through high\nlevel language.\n"},{"name":"caproto","summary":"a bring-your-own-IO implementation of the EPICS Channel Access protocol in pure Python","description":"n/a"},{"name":"mesa-libegl-cos7-aarch64","summary":"(CDT) Mesa libEGL runtime libraries","description":"Mesa libEGL runtime libraries"},{"name":"pytest-freezegun","summary":"Wrap tests with fixtures in freeze_time","description":"Wrap tests with fixtures in freeze_time"},{"name":"dftbplus-python","summary":"DFTB+ general package for performing fast atomistic simulations","description":"n/a"},{"name":"colcon-defaults","summary":"An extension for colcon-core to provide custom default\nvalues for the command line arguments from a configuration file.\n","description":"n/a"},{"name":"dot2tex","summary":"A Graphviz to LaTeX converter","description":"n/a"},{"name":"pytest-github-actions-annotate-failures","summary":"pytest plugin to annotate failed tests with a workflow command for GitHub Actions","description":"n/a"},{"name":"fletcher","summary":"Pandas ExtensionDType/Array backed by Apache Arrow","description":"n/a"},{"name":"colcon-devtools","summary":"An extension for colcon-core to provide information about the plugin system.\n","description":"n/a"},{"name":"bcrypt","summary":"Modern password hashing for your software and your servers","description":"Modern password hashing for your software and your servers\n"},{"name":"pyrfc3339","summary":"Python library for generating and parsing RFC 3339-compliant timestamps.","description":"pyRFC3339 parses and generates RFC 3339-compliant timestamps using\nPython datetime.datetime objects.\n"},{"name":"geospark","summary":"GeoSpark Python","description":"n/a"},{"name":"colcon-library-path","summary":"An extension for colcon-core to set an environment variable to find shared libraries at runtime.\n","description":"n/a"},{"name":"pyro5","summary":"Distributed object middleware for Python (RPC)","description":"n/a"},{"name":"django-fixture-magic","summary":"A few extra management tools to handle fixtures.","description":"n/a"},{"name":"pyunfold","summary":"PyUnfold: A Python package for iterative unfolding","description":"PyUnfold is a Python package for implementing the D'Agostini\niterative unfolding algorithm.\n"},{"name":"pyunlocbox","summary":"Convex Optimization in Python using Proximal Splitting","description":"n/a"},{"name":"pkgconfig-cos7-x86_64","summary":"(CDT) A tool for determining compilation options","description":"The pkgconfig tool determines compilation options. For each required library,\nit reads the configuration file and outputs the necessary compiler and linker\nflags.\n"},{"name":"colcon-metadata","summary":"An extension for colcon-core to fetch and manage package metadata from repositories.\n","description":"n/a"},{"name":"h5utils","summary":"A set of utilities for visualization and conversion of scientific data in the free portable HDF5 format","description":"n/a"},{"name":"colcon-output","summary":"An extension for colcon-core to customize the output in various ways.\n","description":"n/a"},{"name":"xeus-cling","summary":"Cling-based C++ kernel for Jupyter based on xeus","description":"Jupyter kernel for the C++ programming language"},{"name":"plantcv","summary":"An image processing package for plant phenotyping.","description":"n/a"},{"name":"hachoir-wx","summary":"hachoir-wx is a wxWidgets GUI that's meant to provide a (more) user-friendly interface to the hachoir binary parsing engine","description":"n/a"},{"name":"backports.shutil_which","summary":"Backport of shutil.which from Python 3.3","description":"n/a"},{"name":"2dfatmic","summary":"Two-Dimensional Subsurface Flow, Fate and Transport of Microbes and Chemicals Model","description":"This model simulates subsurface flow, fate, and transport of contaminants\nthat are undergoing chemical or biological transformations.\nThis model is applicable to transient conditions in both saturated\nand unsaturated zones.\n"},{"name":"alsa-lib","summary":"Advanced Linux Sound Architecture","description":"n/a"},{"name":"altair","summary":"High-level declarative visualization library for Python.","description":"n/a"},{"name":"alsa-plugins","summary":"The Advanced Linux Sound Architecture (ALSA) - plugins","description":"Plugins for the ALSA library, including play or capture via JACK or Pulse Audio and\nstream conversions.\n"},{"name":"_libgcc_mutex","summary":"Mutex for libgcc and libgcc-ng","description":"n/a"},{"name":"_current_repodata_hack_gcc_linux_64_84","summary":"Meta-package to fix current_repodata","description":"As of writing, conda-forge has versions of the linux compilers that are ahead of the\nones in the global pinnings. The current_repodata.json file only pulls in the latest\nversion of a package by default. Thus anytime one asks for the compilers in the pinnings,\nthe solver will always fail on current_repodata.json and have to pull all of the repodata.\nThe packages here make sure the latest versions of the compilers we use are in\ncurrent_repodata.json by depending on those packages. Thus it solves the solver inefficiency.\nIt also helps in cases when the solver appears to pull older builds of the compilers when they are\nnot explicitly asked for in the environment.\n"},{"name":"django-grappelli","summary":"A jazzy skin for the Django Admin-Interface.","description":"n/a"},{"name":"_current_repodata_hack_gcc_linux_64_75","summary":"Meta-package to fix current_repodata","description":"As of writing, conda-forge has versions of the linux compilers that are ahead of the\nones in the global pinnings. The current_repodata.json file only pulls in the latest\nversion of a package by default. Thus anytime one asks for the compilers in the pinnings,\nthe solver will always fail on current_repodata.json and have to pull all of the repodata.\nThe packages here make sure the latest versions of the compilers we use are in\ncurrent_repodata.json by depending on those packages. Thus it solves the solver inefficiency.\nIt also helps in cases when the solver appears to pull older builds of the compilers when they are\nnot explicitly asked for in the environment.\n"}]
      });
    }, 1000);
  });

export const getPackageVersions = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            "id":"23503556-e632-488f-9334-126220bf51eb",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"linux-64",
            "version":"0.21.10",
            "build_string":"h0efe328_0",
            "build_number":0,
            "filename":"xtensor-0.21.10-h0efe328_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"h0efe328_0",
              "build_number":0,
              "depends":[
                "libgcc-ng >=7.5.0",
                "libstdcxx-ng >=7.5.0",
                "xtl >=0.6.21,<0.7"
              ],
              "license":"BSD-3-Clause",
              "license_family":"BSD",
              "md5":"e4bdbb81bda58fbe8e47822e0b7497c2",
              "name":"xtensor",
              "platform":"linux",
              "sha256":"d8f7a962b91159f1302d0c3d5ffa67fba398f7cf112ff1238665dc2919dc3a0c",
              "size":181465,
              "subdir":"linux-64",
              "timestamp":1605605822776,
              "version":"0.21.10"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-04T03:09:55.032458+00:00"
          },
          {
            "id":"b37b4504-1c3c-4f02-8b14-6e6a12868218",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"linux-64",
            "version":"0.21.10",
            "build_string":"h4bd325d_0",
            "build_number":0,
            "filename":"xtensor-0.21.10-h4bd325d_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"h4bd325d_0",
              "build_number":0,
              "depends":[
                "libgcc-ng >=9.3.0",
                "libstdcxx-ng >=9.3.0",
                "xtl >=0.6.21,<0.7"
              ],
              "license":"BSD-3-Clause",
              "license_family":"BSD",
              "md5":"a2a8f8ccba2e9fbade67924a5b3fc148",
              "name":"xtensor",
              "platform":"linux",
              "sha256":"0fd96a70276d6acea2eb72ff04e19ee017bb155af119fc25e06f8c157f25dd56",
              "size":181724,
              "subdir":"linux-64",
              "timestamp":1606390836348,
              "version":"0.21.10"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-04T03:09:55.076595+00:00"
          },
          {
            "id":"218c198f-cbbe-4ec4-9736-c7fff8bb8e3f",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"osx-64",
            "version":"0.21.10",
            "build_string":"h9a9d8cb_0",
            "build_number":0,
            "filename":"xtensor-0.21.10-h9a9d8cb_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"h9a9d8cb_0",
              "build_number":0,
              "depends":[
                "libcxx >=11.0.0",
                "xtl >=0.6.21,<0.7"
              ],
              "license":"BSD-3-Clause",
              "license_family":"BSD",
              "md5":"e9ac9ca4cb548e931daa85ed7ba28edb",
              "name":"xtensor",
              "platform":"osx",
              "sha256":"d612f3a6e439c8ca95e1677f67ced8a8cfa4715b23d0fe39dd80ac467f083283",
              "size":180857,
              "subdir":"osx-64",
              "timestamp":1606390919035,
              "version":"0.21.10"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-05T22:07:01.095942+00:00"
          },
          {
            "id":"5b034846-e0ab-43e3-ab77-095a0cdb066c",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"linux-64",
            "version":"0.21.9",
            "build_string":"h0efe328_1",
            "build_number":1,
            "filename":"xtensor-0.21.9-h0efe328_1.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"h0efe328_1",
              "build_number":1,
              "depends":[
                "libgcc-ng >=7.5.0",
                "libstdcxx-ng >=7.5.0",
                "xtl >=0.6.21,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"81eaeea794cb8aecad5ac4d6816d466c",
              "name":"xtensor",
              "platform":"linux",
              "sha256":"5336095876530d4513a12505a128d8c335f7098b12f5dbdfc720166724f1d8b7",
              "size":187415,
              "subdir":"linux-64",
              "timestamp":1605257503329,
              "version":"0.21.9"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-04T03:09:55.507659+00:00"
          },
          {
            "id":"77d36d2a-534e-448f-bb9e-1226f51244fd",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"linux-ppc64le",
            "version":"0.21.10",
            "build_string":"h2acdbc0_0",
            "build_number":0,
            "filename":"xtensor-0.21.10-h2acdbc0_0.tar.bz2",
            "info":{
              "arch":"ppc64le",
              "build":"h2acdbc0_0",
              "build_number":0,
              "depends":[
                "libgcc-ng >=9.3.0",
                "libstdcxx-ng >=9.3.0",
                "xtl >=0.6.21,<0.7"
              ],
              "license":"BSD-3-Clause",
              "license_family":"BSD",
              "md5":"69371bbaac58d2d619af789bd786c0c3",
              "name":"xtensor",
              "platform":"linux",
              "sha256":"a910ea6643adfcb09b0bcb939733afc9c82e2d50adf4a8c8c3c1209bb07f216a",
              "size":181743,
              "subdir":"linux-ppc64le",
              "timestamp":1606390887479,
              "version":"0.21.10"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-04T15:06:08.337489+00:00"
          },
          {
            "id":"5e5b61b1-9a52-45f2-9c60-6aa5c6553c86",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"linux-aarch64",
            "version":"0.21.10",
            "build_string":"hd62202e_0",
            "build_number":0,
            "filename":"xtensor-0.21.10-hd62202e_0.tar.bz2",
            "info":{
              "arch":"aarch64",
              "build":"hd62202e_0",
              "build_number":0,
              "depends":[
                "libgcc-ng >=9.3.0",
                "libstdcxx-ng >=9.3.0",
                "xtl >=0.6.21,<0.7"
              ],
              "license":"BSD-3-Clause",
              "license_family":"BSD",
              "md5":"9d050280e653e0fd91635c12a9a8ecb1",
              "name":"xtensor",
              "platform":"linux",
              "sha256":"8ca09d5e60987980248931046f4a1b11d672bcaf59d02e85ea2c664b825e0f14",
              "size":180849,
              "subdir":"linux-aarch64",
              "timestamp":1606390778227,
              "version":"0.21.10"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-04T06:18:15.306285+00:00"
          },
          {
            "id":"e39ca393-0df6-4ae1-9807-4e36214ad3aa",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"osx-64",
            "version":"0.21.9",
            "build_string":"h6516342_1",
            "build_number":1,
            "filename":"xtensor-0.21.9-h6516342_1.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"h6516342_1",
              "build_number":1,
              "depends":[
                "libcxx >=10.0.1",
                "xtl >=0.6.21,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"7d5619f821f3d7e301d4de168e4e5c69",
              "name":"xtensor",
              "platform":"osx",
              "sha256":"b64ca9639ac0e095ee032f6ceca16e843118802df565ef77a206d94c0cb7fbdb",
              "size":187195,
              "subdir":"osx-64",
              "timestamp":1605257543200,
              "version":"0.21.9"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-05T22:07:01.583254+00:00"
          },
          {
            "id":"7415e07a-c950-4716-9743-cd87a75890c0",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"linux-64",
            "version":"0.21.9",
            "build_string":"h0efe328_0",
            "build_number":0,
            "filename":"xtensor-0.21.9-h0efe328_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"h0efe328_0",
              "build_number":0,
              "depends":[
                "libgcc-ng >=7.5.0",
                "libstdcxx-ng >=7.5.0",
                "xtl >=0.6.21,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"8680542548a781dd27e0dcb8eb0a0e30",
              "name":"xtensor",
              "platform":"linux",
              "sha256":"57e9a738e66b17d5d0e87dfeebef0334f66bc0cac03458c923f6b45af3d4ac35",
              "size":186961,
              "subdir":"linux-64",
              "timestamp":1604528318694,
              "version":"0.21.9"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-04T03:09:55.459215+00:00"
          },
          {
            "id":"5305981e-823c-40b9-bf79-547b86038e34",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"osx-64",
            "version":"0.21.10",
            "build_string":"h6516342_0",
            "build_number":0,
            "filename":"xtensor-0.21.10-h6516342_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"h6516342_0",
              "build_number":0,
              "depends":[
                "libcxx >=10.0.1",
                "xtl >=0.6.21,<0.7"
              ],
              "license":"BSD-3-Clause",
              "license_family":"BSD",
              "md5":"19d876134069f5edc9d1a3f07cf2e13d",
              "name":"xtensor",
              "platform":"osx",
              "sha256":"1b886ad67ab462848a19599130e5ea13961e3cd76f353f826c1e2feddf8593a1",
              "size":181461,
              "subdir":"osx-64",
              "timestamp":1605606056788,
              "version":"0.21.10"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-05T22:07:01.040601+00:00"
          },
          {
            "id":"1595c3ea-354d-4175-a070-b4d54f586606",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"linux-64",
            "version":"0.21.8",
            "build_string":"hc9558a2_0",
            "build_number":0,
            "filename":"xtensor-0.21.8-hc9558a2_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"hc9558a2_0",
              "build_number":0,
              "depends":[
                "libgcc-ng >=7.5.0",
                "libstdcxx-ng >=7.5.0",
                "xtl >=0.6.20,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"1030174db5c183f3afb4181a0a02873d",
              "name":"xtensor",
              "platform":"linux",
              "sha256":"9f0c14cf0442d666fc953eebc904aa5b6db83115ea491ffab72f18b209b6718a",
              "size":186940,
              "subdir":"linux-64",
              "timestamp":1602861196366,
              "version":"0.21.8"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-04T03:09:55.409755+00:00"
          },
          {
            "id":"f4e68f5a-f825-4515-8a13-c6b5db6ecffb",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"osx-64",
            "version":"0.21.9",
            "build_string":"h6516342_0",
            "build_number":0,
            "filename":"xtensor-0.21.9-h6516342_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"h6516342_0",
              "build_number":0,
              "depends":[
                "libcxx >=10.0.1",
                "xtl >=0.6.21,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"0bbf25a53ac92bbc69267d971b099718",
              "name":"xtensor",
              "platform":"osx",
              "sha256":"a114c71c071a2553c5970acf4843e6119e750686932f1a56f3f81a4037ba3f37",
              "size":186707,
              "subdir":"osx-64",
              "timestamp":1604528396655,
              "version":"0.21.9"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-05T22:07:01.532958+00:00"
          },
          {
            "id":"772cf1b3-a9d1-4880-90f8-a73e91965237",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"linux-64",
            "version":"0.21.7",
            "build_string":"hc9558a2_0",
            "build_number":0,
            "filename":"xtensor-0.21.7-hc9558a2_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"hc9558a2_0",
              "build_number":0,
              "depends":[
                "libgcc-ng >=7.5.0",
                "libstdcxx-ng >=7.5.0",
                "xtl >=0.6.18,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"173dc094944472de2a040649885f29f3",
              "name":"xtensor",
              "platform":"linux",
              "sha256":"96a08817b539449b3c0edc92e7606fd34a8eec9197baf2c9bfc823a1173b1b1b",
              "size":184431,
              "subdir":"linux-64",
              "timestamp":1601647717034,
              "version":"0.21.7"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-04T03:09:55.359231+00:00"
          },
          {
            "id":"9032fdc2-41f5-4c58-8cb8-661936d70eca",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"linux-64",
            "version":"0.21.6",
            "build_string":"hc9558a2_0",
            "build_number":0,
            "filename":"xtensor-0.21.6-hc9558a2_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"hc9558a2_0",
              "build_number":0,
              "depends":[
                "libgcc-ng >=7.5.0",
                "libstdcxx-ng >=7.5.0",
                "xtl >=0.6.18,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"06e490aef06689cd58a61f98f3aa1276",
              "name":"xtensor",
              "platform":"linux",
              "sha256":"abf171c2f20245ade8421c1a9d266edaab6d95771f75a11d4aef4fb606de237f",
              "size":183147,
              "subdir":"linux-64",
              "timestamp":1599896502870,
              "version":"0.21.6"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-04T03:09:55.309392+00:00"
          },
          {
            "id":"cc52d471-7bdc-4dc7-ab20-471ae38a0224",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"linux-64",
            "version":"0.21.5",
            "build_string":"hc9558a2_0",
            "build_number":0,
            "filename":"xtensor-0.21.5-hc9558a2_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"hc9558a2_0",
              "build_number":0,
              "depends":[
                "libgcc-ng >=7.3.0",
                "libstdcxx-ng >=7.3.0",
                "xtl >=0.6.9,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"d330e02e5ed58330638a24601b7e4887",
              "name":"xtensor",
              "platform":"linux",
              "sha256":"b13462117a504711b5cb7c17313f0e1fca49fcf4a7c82bec111d5d405067574b",
              "size":175634,
              "subdir":"linux-64",
              "timestamp":1586869127208,
              "version":"0.21.5"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-04T03:09:55.263648+00:00"
          },
          {
            "id":"324ca0f1-bfe4-4204-a340-c682ebd2596b",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"osx-64",
            "version":"0.21.8",
            "build_string":"h879752b_0",
            "build_number":0,
            "filename":"xtensor-0.21.8-h879752b_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"h879752b_0",
              "build_number":0,
              "depends":[
                "libcxx >=10.0.1",
                "xtl >=0.6.20,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"b1cb5d8aa8626e1cb8d05d7c766ec8a7",
              "name":"xtensor",
              "platform":"osx",
              "sha256":"4eb4fcd6b4a1765cea1a13ae43bb76ad5bf558d59f53f5e561663a03f4045656",
              "size":186967,
              "subdir":"osx-64",
              "timestamp":1602861265141,
              "version":"0.21.8"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-05T22:07:01.481130+00:00"
          },
          {
            "id":"aa945751-0a92-426a-8342-da03ac6b9999",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"linux-64",
            "version":"0.21.4",
            "build_string":"hc9558a2_0",
            "build_number":0,
            "filename":"xtensor-0.21.4-hc9558a2_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"hc9558a2_0",
              "build_number":0,
              "depends":[
                "libgcc-ng >=7.3.0",
                "libstdcxx-ng >=7.3.0",
                "xtl >=0.6.9,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"84df5b3be2ad8c0031d17d0ad44f9e83",
              "name":"xtensor",
              "platform":"linux",
              "sha256":"838a262d9048f2e86245f52c270d6faf9a06b1e81964f09949f0b47b513d3194",
              "size":174395,
              "subdir":"linux-64",
              "timestamp":1583502891936,
              "version":"0.21.4"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-04T03:09:55.215164+00:00"
          },
          {
            "id":"0f65ac77-e7c2-4efe-ac19-2bf763409243",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"osx-64",
            "version":"0.21.7",
            "build_string":"h879752b_0",
            "build_number":0,
            "filename":"xtensor-0.21.7-h879752b_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"h879752b_0",
              "build_number":0,
              "depends":[
                "libcxx >=10.0.1",
                "xtl >=0.6.18,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"b214d79f5059e3e82b3e1cc67f6d386c",
              "name":"xtensor",
              "platform":"osx",
              "sha256":"81c9c533a1ab8b19b317cd50cc89b8a82ffb1f2adac702406dc0747e4bed0e43",
              "size":184472,
              "subdir":"osx-64",
              "timestamp":1601647770437,
              "version":"0.21.7"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-05T22:07:01.427853+00:00"
          },
          {
            "id":"c0299c82-7dd1-4edc-9bbd-99f5207a6dc8",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"linux-64",
            "version":"0.21.3",
            "build_string":"hc9558a2_0",
            "build_number":0,
            "filename":"xtensor-0.21.3-hc9558a2_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"hc9558a2_0",
              "build_number":0,
              "depends":[
                "libgcc-ng >=7.3.0",
                "libstdcxx-ng >=7.3.0",
                "xtl >=0.6.9,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"b560dcff4eb9a8d3f38d6545d7cf8471",
              "name":"xtensor",
              "platform":"linux",
              "sha256":"8ae347b6e4d3cc981a291c5e7180f001473e68a5926e735662252191de2e5568",
              "size":171052,
              "subdir":"linux-64",
              "timestamp":1579766518730,
              "version":"0.21.3"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-04T03:09:55.170149+00:00"
          },
          {
            "id":"cc25204c-2eaf-4362-96f5-35fdfdc7a412",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"linux-64",
            "version":"0.21.2",
            "build_string":"hc9558a2_0",
            "build_number":0,
            "filename":"xtensor-0.21.2-hc9558a2_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"hc9558a2_0",
              "build_number":0,
              "depends":[
                "libgcc-ng >=7.3.0",
                "libstdcxx-ng >=7.3.0",
                "xtl >=0.6.9,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"84bc39f4f9ee16ec213005091b942d4a",
              "name":"xtensor",
              "platform":"linux",
              "sha256":"09db03ee7accc369e680a0f0581ac1f0ff3fedc21adb3f4001b44fb2333ca01d",
              "size":169679,
              "subdir":"linux-64",
              "timestamp":1576539868129,
              "version":"0.21.2"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-04T03:09:55.122964+00:00"
          },
          {
            "id":"e4a39176-2ec8-4b88-b44b-36cd3801515a",
            "channel_name":"conda-forge",
            "package_name":"xtensor",
            "platform":"osx-64",
            "version":"0.21.6",
            "build_string":"h879752b_0",
            "build_number":0,
            "filename":"xtensor-0.21.6-h879752b_0.tar.bz2",
            "info":{
              "arch":"x86_64",
              "build":"h879752b_0",
              "build_number":0,
              "depends":[
                "libcxx >=10.0.1",
                "xtl >=0.6.18,<0.7"
              ],
              "license":"BSD 3-Clause",
              "license_family":"BSD",
              "md5":"2fb3e940b021524297452e6bb46b6d11",
              "name":"xtensor",
              "platform":"osx",
              "sha256":"1d728b058078fc693303b87284561ec4b903df706c44e1c5677c9a2aa0d016c6",
              "size":183335,
              "subdir":"osx-64",
              "timestamp":1599896548646,
              "version":"0.21.6"
            },
            "uploader":{
              "name":"Wolf Vollprecht",
              "avatar_url":"https://avatars0.githubusercontent.com/u/885054?v=4"
            },
            "time_created":"2020-12-05T22:07:01.370496+00:00"
          }
        ]
      });
    }, 1000);
  });
