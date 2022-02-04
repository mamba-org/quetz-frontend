// This file is auto-generated from the corresponding file in /dev_mode
/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { App } from '@quetz-frontend/application';

import { PageConfig } from '@jupyterlab/coreutils';

import './style.js';

// Promise.allSettled polyfill, until our supported browsers implement it
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
if (Promise.allSettled === undefined) {
  Promise.allSettled = (promises) =>
    Promise.all(
      promises.map((promise) =>
        promise.then(
          (value) => ({
            status: 'fulfilled',
            value,
          }),
          (reason) => ({
            status: 'rejected',
            reason,
          })
        )
      )
    );
}

async function createModule(scope, module) {
  try {
    const factory = await window._QUETZ[scope].get(module);
    return factory();
  } catch (e) {
    console.warn(
      `Failed to create module: package: ${scope}; module: ${module}`
    );
    throw e;
  }
}

export async function main() {
  var disabled = [];
  var deferred = [];
  var ignorePlugins = [];

  const federatedExtensionPromises = [];
  const federatedStylePromises = [];

  const register = [
    require('@jupyterlab/apputils-extension').default.filter(({ id }) =>
      [
        '@jupyterlab/apputils-extension:settings',
        '@jupyterlab/apputils-extension:themes',
      ].includes(id)
    ),
    require('@quetz-frontend/application-extension'),
    require('@quetz-frontend/channels-extension'),
    require('@quetz-frontend/jobs-extension'),
    require('@quetz-frontend/login-extension'),
    require('@quetz-frontend/menu-extension'),
    require('@quetz-frontend/search-extension'),
    require('@quetz-frontend/user-extension'),
    require('@quetz-frontend/home-extension'),
    require('quetz-theme'),
  ];

  // Start initializing the federated extensions
  const extensions = JSON.parse(PageConfig.getOption('federated_extensions'));

  const queuedFederated = [];

  extensions.forEach((data) => {
    if (data.extension) {
      queuedFederated.push(data.name);
      federatedExtensionPromises.push(createModule(data.name, data.extension));
    }
    if (data.style) {
      federatedStylePromises.push(createModule(data.name, data.style));
    }
  });

  /**
   * Iterate over active plugins in an extension.
   *
   * #### Notes
   * This also populates the disabled, deferred, and ignored arrays.
   */
  function* activePlugins(extension) {
    // Handle commonjs or es2015 modules
    let exports;
    if (extension.hasOwnProperty('__esModule')) {
      exports = extension.default;
    } else {
      // CommonJS exports.
      exports = extension;
    }

    let plugins = Array.isArray(exports) ? exports : [exports];
    for (let plugin of plugins) {
      if (PageConfig.Extension.isDisabled(plugin.id)) {
        disabled.push(plugin.id);
        continue;
      }
      if (PageConfig.Extension.isDeferred(plugin.id)) {
        deferred.push(plugin.id);
        ignorePlugins.push(plugin.id);
      }
      yield plugin;
    }
  }

  // Add the federated extensions.
  const federatedExtensions = await Promise.allSettled(
    federatedExtensionPromises
  );
  federatedExtensions.forEach((p) => {
    if (p.status === 'fulfilled') {
      for (let plugin of activePlugins(p.value)) {
        register.push(plugin);
      }
    } else {
      console.error(p.reason);
    }
  });

  // Load all federated component styles and log errors for any that do not
  (await Promise.allSettled(federatedStylePromises))
    .filter(({ status }) => status === 'rejected')
    .forEach(({ reason }) => {
      console.error(reason);
    });

  const app = new App({
    disabled: {
      matches: disabled,
      patterns: PageConfig.Extension.disabled.map(function (val) {
        return val.raw;
      }),
    },
    deferred: {
      matches: deferred,
      patterns: PageConfig.Extension.deferred.map(function (val) {
        return val.raw;
      }),
    },
  });
  app.registerPluginModules(register);
  await app.start({ ignorePlugins });
}
