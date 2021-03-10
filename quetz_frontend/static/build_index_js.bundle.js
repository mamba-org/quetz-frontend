/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk_QUETZ_CORE_OUTPUT"] = self["webpackChunk_QUETZ_CORE_OUTPUT"] || []).push([["build_index_js"],{

/***/ "./build/index.js":
/*!************************!*\
  !*** ./build/index.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/coreutils */ \"webpack/sharing/consume/default/@jupyterlab/coreutils/@jupyterlab/coreutils\");\n/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__);\n// Copyright (c) Jupyter Development Team.\n// Distributed under the terms of the Modified BSD License.\n\n\n\n//require('./style.js');\n\n// Promise.allSettled polyfill, until our supported browsers implement it\n// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled\n// eslint-disable-next-line no-undef\nif (Promise.allSettled === undefined) {\n  Promise.allSettled = (promises) =>\n    Promise.all(\n      promises.map(promise =>\n        promise.then(\n          value => ({\n            status: 'fulfilled',\n            value\n          }),\n          reason => ({\n            status: 'rejected',\n            reason\n          })\n        )\n      )\n    );\n}\n\nfunction loadScript(url) {\n  return new Promise((resolve, reject) => {\n    const newScript = document.createElement('script');\n    newScript.onerror = reject;\n    newScript.onload = resolve;\n    newScript.async = true;\n    document.head.appendChild(newScript);\n    newScript.src = url;\n  });\n}\n\nasync function loadComponent(url, scope) {\n  console.debug(url);\n  loadScript(url)\n    .then(v => console.debug(v))\n    .catch(e => console.debug(e));\n\n  // From MIT-licensed https://github.com/module-federation/module-federation-examples/blob/af043acd6be1718ee195b2511adf6011fba4233c/advanced-api/dynamic-remotes/app1/src/App.js#L6-L12\n  // eslint-disable-next-line no-undef\n  await __webpack_require__.I('default');\n  console.debug(window);\n  console.debug(window._QUETZ);\n  const container = window._QUETZ[scope];\n  // Initialize the container, it may provide shared modules and may need ours\n  // eslint-disable-next-line no-undef\n  await container.init(__webpack_require__.S.default);\n}\n\nasync function createModule(scope, module) {\n  try {\n    const factory = await window._QUETZ[scope].get(module);\n    return factory();\n  } catch (e) {\n    console.warn(\n      `Failed to create module: package: ${scope}; module: ${module}`\n    );\n    throw e;\n  }\n}\n\n/**\n * The main function\n */\nasync function main() {\n  const app = __webpack_require__(/*! @quetz-frontend/app */ \"./index.js\").App;\n  const disabled = [];\n  const mods = [\n    __webpack_require__(/*! @jupyterlab/apputils-extension */ \"webpack/sharing/consume/default/@jupyterlab/apputils-extension/@jupyterlab/apputils-extension\").default.filter(({ id }) =>\n      [\n        '@jupyterlab/apputils-extension:settings',\n        '@jupyterlab/apputils-extension:themes'\n      ].includes(id)\n    ),\n    __webpack_require__(/*! @jupyterlab/theme-light-extension */ \"webpack/sharing/consume/default/@jupyterlab/theme-light-extension/@jupyterlab/theme-light-extension\"),\n    __webpack_require__(/*! @jupyterlab/theme-dark-extension */ \"webpack/sharing/consume/default/@jupyterlab/theme-dark-extension/@jupyterlab/theme-dark-extension\")\n  ];\n\n  /**\n   * Iterate over active plugins in an extension.\n   *\n   * #### Notes\n   * This also populates the disabled\n   */\n  function* activePlugins(extension) {\n    // Handle commonjs or es2015 modules\n    let exports;\n    if (Object.prototype.hasOwnProperty.call(extension, '__esModule')) {\n      exports = extension.default;\n    } else {\n      // CommonJS exports.\n      exports = extension;\n    }\n\n    let plugins = Array.isArray(exports) ? exports : [exports];\n    for (let plugin of plugins) {\n      if (_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PageConfig.Extension.isDisabled(plugin.id)) {\n        disabled.push(plugin.id);\n        continue;\n      }\n      yield plugin;\n    }\n  }\n\n  console.debug(\"PageConfig.extensions\", _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PageConfig.Extension);\n  console.debug(\"PageConfig.extensions\", _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PageConfig);\n  const plugins = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PageConfig.getOption('federated_extensions')  || \"[]\";\n  console.debug(\"plugins\", plugins);\n  const extensions = JSON.parse(plugins);\n  console.debug(\"extension_data\", extensions);\n  //{extension: \"./extension\", load: \"static/remoteEntry.a1fe33117f8149d71c15.js\", name: \"@mamba-org/gator-lab\", style: \"./style\"}\n\n  const federatedExtensionPromises = [];\n  const federatedMimeExtensionPromises = [];\n  const federatedStylePromises = [];\n  \n  /* const extensions = await Promise.allSettled(\n    extension_data.map(async (data) => {\n      console.debug(\"data\", data);\n      await loadComponent(\n        `${URLExt.join(\n          PageConfig.getOption('fullLabextensionsUrl'),\n          data.name,\n          data.src\n        )}`,\n        data.name\n      );\n      return data;\n    })\n  ); */\n\n  extensions.forEach((data) => {\n    console.debug(data);\n    /* if (p.status === 'rejected') {\n      // There was an error loading the component\n      console.error(p.reason);\n      return;\n    } */\n\n    //const data = p.value;\n    if (data.name) {\n      federatedExtensionPromises.push(createModule(data.name, data.src));\n    }\n  });\n\n  // Add the federated extensions.\n  // TODO: Add support for disabled extensions\n  const federatedExtensions = await Promise.allSettled(\n    federatedExtensionPromises\n  );\n  federatedExtensions.forEach((p) => {\n    if (p.status === 'fulfilled') {\n      for (let plugin of activePlugins(p.value)) {\n        mods.push(plugin);\n      }\n    } else {\n      console.error(p.reason);\n    }\n  });\n\n  // Load all federated component styles and log errors for any that do not\n  (await Promise.allSettled(federatedStylePromises))\n    .filter(({ status }) => status === 'rejected')\n    .forEach(({ reason }) => {\n      console.error(reason);\n    });\n\n  app.registerPluginModules(mods);\n  await app.start();\n}\n\nwindow.addEventListener('load', main);\n\n\n//# sourceURL=webpack://_QUETZ.CORE_OUTPUT/./build/index.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/coreutils */ \"webpack/sharing/consume/default/@jupyterlab/coreutils/@jupyterlab/coreutils\");\n/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__);\n// Copyright (c) Jupyter Development Team.\n// Distributed under the terms of the Modified BSD License.\n\n\n\n//require('./style.js');\n\n// Promise.allSettled polyfill, until our supported browsers implement it\n// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled\n// eslint-disable-next-line no-undef\nif (Promise.allSettled === undefined) {\n  Promise.allSettled = (promises) =>\n    Promise.all(\n      promises.map(promise =>\n        promise.then(\n          value => ({\n            status: 'fulfilled',\n            value\n          }),\n          reason => ({\n            status: 'rejected',\n            reason\n          })\n        )\n      )\n    );\n}\n\nfunction loadScript(url) {\n  return new Promise((resolve, reject) => {\n    const newScript = document.createElement('script');\n    newScript.onerror = reject;\n    newScript.onload = resolve;\n    newScript.async = true;\n    document.head.appendChild(newScript);\n    newScript.src = url;\n  });\n}\n\nasync function loadComponent(url, scope) {\n  console.debug(url);\n  loadScript(url)\n    .then(v => console.debug(v))\n    .catch(e => console.debug(e));\n\n  // From MIT-licensed https://github.com/module-federation/module-federation-examples/blob/af043acd6be1718ee195b2511adf6011fba4233c/advanced-api/dynamic-remotes/app1/src/App.js#L6-L12\n  // eslint-disable-next-line no-undef\n  await __webpack_require__.I('default');\n  console.debug(window);\n  console.debug(window._QUETZ);\n  const container = window._QUETZ[scope];\n  // Initialize the container, it may provide shared modules and may need ours\n  // eslint-disable-next-line no-undef\n  await container.init(__webpack_require__.S.default);\n}\n\nasync function createModule(scope, module) {\n  try {\n    const factory = await window._QUETZ[scope].get(module);\n    return factory();\n  } catch (e) {\n    console.warn(\n      `Failed to create module: package: ${scope}; module: ${module}`\n    );\n    throw e;\n  }\n}\n\n/**\n * The main function\n */\nasync function main() {\n  const app = __webpack_require__(/*! @quetz-frontend/app */ \"./index.js\").App;\n  const disabled = [];\n  const mods = [\n    __webpack_require__(/*! @jupyterlab/apputils-extension */ \"webpack/sharing/consume/default/@jupyterlab/apputils-extension/@jupyterlab/apputils-extension\").default.filter(({ id }) =>\n      [\n        '@jupyterlab/apputils-extension:settings',\n        '@jupyterlab/apputils-extension:themes'\n      ].includes(id)\n    ),\n    __webpack_require__(/*! @jupyterlab/theme-light-extension */ \"webpack/sharing/consume/default/@jupyterlab/theme-light-extension/@jupyterlab/theme-light-extension\"),\n    __webpack_require__(/*! @jupyterlab/theme-dark-extension */ \"webpack/sharing/consume/default/@jupyterlab/theme-dark-extension/@jupyterlab/theme-dark-extension\")\n  ];\n\n  /**\n   * Iterate over active plugins in an extension.\n   *\n   * #### Notes\n   * This also populates the disabled\n   */\n  function* activePlugins(extension) {\n    // Handle commonjs or es2015 modules\n    let exports;\n    if (Object.prototype.hasOwnProperty.call(extension, '__esModule')) {\n      exports = extension.default;\n    } else {\n      // CommonJS exports.\n      exports = extension;\n    }\n\n    let plugins = Array.isArray(exports) ? exports : [exports];\n    for (let plugin of plugins) {\n      if (_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PageConfig.Extension.isDisabled(plugin.id)) {\n        disabled.push(plugin.id);\n        continue;\n      }\n      yield plugin;\n    }\n  }\n\n  console.debug(\"PageConfig.extensions\", _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PageConfig.Extension);\n  console.debug(\"PageConfig.extensions\", _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PageConfig);\n  const plugins = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PageConfig.getOption('federated_extensions')  || \"[]\";\n  console.debug(\"plugins\", plugins);\n  const extensions = JSON.parse(plugins);\n  console.debug(\"extension_data\", extensions);\n  //{extension: \"./extension\", load: \"static/remoteEntry.a1fe33117f8149d71c15.js\", name: \"@mamba-org/gator-lab\", style: \"./style\"}\n\n  const federatedExtensionPromises = [];\n  const federatedMimeExtensionPromises = [];\n  const federatedStylePromises = [];\n  \n  /* const extensions = await Promise.allSettled(\n    extension_data.map(async (data) => {\n      console.debug(\"data\", data);\n      await loadComponent(\n        `${URLExt.join(\n          PageConfig.getOption('fullLabextensionsUrl'),\n          data.name,\n          data.src\n        )}`,\n        data.name\n      );\n      return data;\n    })\n  ); */\n\n  extensions.forEach((data) => {\n    console.debug(data);\n    /* if (p.status === 'rejected') {\n      // There was an error loading the component\n      console.error(p.reason);\n      return;\n    } */\n\n    //const data = p.value;\n    if (data.name) {\n      federatedExtensionPromises.push(createModule(data.name, data.src));\n    }\n  });\n\n  // Add the federated extensions.\n  // TODO: Add support for disabled extensions\n  const federatedExtensions = await Promise.allSettled(\n    federatedExtensionPromises\n  );\n  federatedExtensions.forEach((p) => {\n    if (p.status === 'fulfilled') {\n      for (let plugin of activePlugins(p.value)) {\n        mods.push(plugin);\n      }\n    } else {\n      console.error(p.reason);\n    }\n  });\n\n  // Load all federated component styles and log errors for any that do not\n  (await Promise.allSettled(federatedStylePromises))\n    .filter(({ status }) => status === 'rejected')\n    .forEach(({ reason }) => {\n      console.error(reason);\n    });\n\n  app.registerPluginModules(mods);\n  await app.start();\n}\n\nwindow.addEventListener('load', main);\n\n\n//# sourceURL=webpack://_QUETZ.CORE_OUTPUT/./index.js?");

/***/ })

}]);