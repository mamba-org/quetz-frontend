import {
  JupyterFrontEnd,
<<<<<<< HEAD
  JupyterFrontEndContextMenu,
} from '@jupyterlab/application';
import { CommandLinker } from '@jupyterlab/apputils';
=======
  JupyterLab,
  createRendermimePlugins
} from '@jupyterlab/application';
>>>>>>> f266891 (Adds support for disabling extensions)
import { PageConfig } from '@jupyterlab/coreutils';
import { ServiceManager } from '@jupyterlab/services';
import { ContextMenuSvg } from '@jupyterlab/ui-components';
import { Application, IPlugin } from '@lumino/application';
import { ISignal, Signal } from '@lumino/signaling';
import { QuetzServiceManager } from './servicemanager';
import { IShell, Shell } from './shell';

export type QuetzFrontEnd = Application<JupyterFrontEnd.IShell>;

/**
 * The type for all QuetzFrontEnd application plugins.
 *
 * @typeparam T - The type that the plugin `provides` upon being activated.
 */
export type QuetzFrontEndPlugin<T> = IPlugin<QuetzFrontEnd, T>;

/**
 * App is the main application class. It is instantiated once and shared.
 */
<<<<<<< HEAD
export class App extends Application<Shell> {
=======
export class App extends JupyterFrontEnd<IShell> {

  private _info: JupyterLab.IInfo = JupyterLab.defaultInfo;

>>>>>>> f266891 (Adds support for disabling extensions)
  /**
   * Construct a new App object.
   *
   * @param options The instantiation options for an application.
   */
  constructor(options: App.IOptions = {}) {
    super({
<<<<<<< HEAD
      ...options,
      shell: options.shell ?? new Shell(),
    });

    this.serviceManager = new QuetzServiceManager();

    // render context menu/submenus with inline svg icon tweaks
    this.contextMenu = new ContextMenuSvg({
      commands: this.commands,
      renderer: options.contextMenuRenderer,
      groupByTarget: false,
      sortBySelector: false,
    });

    // The default restored promise if one does not exist in the options.
    const restored = new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });

    this.commandLinker =
      options.commandLinker || new CommandLinker({ commands: this.commands });

    this.restored =
      options.restored ||
      this.started.then(() => restored).catch(() => restored);
=======
      shell: options.shell,
      // TODO: uncomment when JupyterLab 4.0 is released
      //serviceManager: new ServiceManager({
      //  standby: () => true
      //})
    });

    // Create an IInfo dictionary from the options to override the defaults.
    const info = Object.keys(JupyterLab.defaultInfo).reduce((acc, val) => {
      if (val in options) {
        (acc as any)[val] = JSON.parse(JSON.stringify((options as any)[val]));
      }
      return acc;
    }, {} as Partial<JupyterLab.IInfo>);

    // Populate application info.
    this._info = { ...JupyterLab.defaultInfo, ...info };

    if (options.mimeExtensions) {
      for (const plugin of createRendermimePlugins(options.mimeExtensions)) {
        this.registerPlugin(plugin);
      }
    }
>>>>>>> f266891 (Adds support for disabling extensions)
  }

  /**
   * The name of the JupyterLab application.
   */
  readonly name = PageConfig.getOption('appName') || 'Quetz';

  /**
  * A namespace/prefix plugins may use to denote their provenance.
  */
  readonly namespace = PageConfig.getOption('appNamespace') || this.name;

  /**
  * A list of all errors encountered when registering plugins.
  */
  readonly registerPluginErrors: Array<Error> = [];

  /**
  * The version of the JupyterLab application.
  */
  readonly version = PageConfig.getOption('appVersion') || '0.1.0';

  /**
   * The JupyterLab application information dictionary.
   */
  get info(): JupyterLab.IInfo {
    return this._info;
  }

  /**
   * The command linker used by the application.
   */
  readonly commandLinker: CommandLinker;

  /**
   * The application context menu.
   */
  readonly contextMenu: ContextMenuSvg;

  /**
   * Promise that resolves when state is first restored.
   */
  readonly restored: Promise<void>;

  /**
   * The service manager used by the application.
   */
  readonly serviceManager: ServiceManager.IManager;

  /**
   * The application form factor, e.g., `desktop` or `mobile`.
   */
  get format(): 'desktop' | 'mobile' {
    return this._format;
  }
  set format(format: 'desktop' | 'mobile') {
    if (this._format !== format) {
      this._format = format;
      document.body.dataset['format'] = format;
      this._formatChanged.emit(format);
    }
  }

  /**
   * A signal that emits when the application form factor changes.
   */
  get formatChanged(): ISignal<this, 'desktop' | 'mobile'> {
    return this._formatChanged;
  }

  /**
   * The Quetz application paths dictionary.
   */
  get paths(): JupyterFrontEnd.IPaths {
<<<<<<< HEAD
    return {
      urls: {
        base: PageConfig.getOption('baseUrl'),
        notFound: PageConfig.getOption('notFoundUrl'),
        app: PageConfig.getOption('appUrl'),
        static: PageConfig.getOption('staticUrl'),
        settings: PageConfig.getOption('settingsUrl'),
        themes: PageConfig.getOption('themesUrl'),
        doc: PageConfig.getOption('docUrl'),
        translations: PageConfig.getOption('translationsApiUrl'),
      },
      directories: {
        appSettings: PageConfig.getOption('appSettingsDir'),
        schemas: PageConfig.getOption('schemasDir'),
        static: PageConfig.getOption('staticDir'),
        templates: PageConfig.getOption('templatesDir'),
        themes: PageConfig.getOption('themesDir'),
        userSettings: PageConfig.getOption('userSettingsDir'),
        serverRoot: PageConfig.getOption('serverRoot'),
        workspaces: '',
      },
    };
=======
    return JupyterLab.defaultPaths;
>>>>>>> f266891 (Adds support for disabling extensions)
  }

  /**
   * Walks up the DOM hierarchy of the target of the active `contextmenu`
   * event, testing each HTMLElement ancestor for a user-supplied function. This can
   * be used to find an HTMLElement on which to operate, given a context menu click.
   *
   * @param fn - a function that takes an `HTMLElement` and returns a
   *   boolean for whether it is the element the requester is seeking.
   * @returns an HTMLElement or undefined, if none is found.
   */
  contextMenuHitTest(
    fn: (node: HTMLElement) => boolean
  ): HTMLElement | undefined {
    if (
      !this._contextMenuEvent ||
      !(this._contextMenuEvent.target instanceof Node)
    ) {
      return undefined;
    }
    let node: Node | null = this._contextMenuEvent.target;
    do {
      if (node instanceof HTMLElement && fn(node)) {
        return node;
      }
      node = node.parentNode;
    } while (node && node.parentNode && node !== node.parentNode);
    return undefined;

    // TODO: we should be able to use .composedPath() to simplify this function
    // down to something like the below, but it seems like composedPath is
    // sometimes returning an empty list.
    /*
    if (this._contextMenuEvent) {
      this._contextMenuEvent
        .composedPath()
        .filter(x => x instanceof HTMLElement)
        .find(test);
    }
    return undefined;
    */
  }

  /**
   * A method invoked on a document `'contextmenu'` event.
   *
   * @param event mouse event
   */
  protected evtContextMenu(event: MouseEvent): void {
    this._contextMenuEvent = event;
    if (event.shiftKey) {
      return;
    }
    const opened = this.contextMenu.open(event);
    if (opened) {
      const items = this.contextMenu.menu.items;
      // If only the context menu information will be shown,
      // with no real commands, close the context menu and
      // allow the native one to open.
      if (
        items.length === 1 &&
        items[0].command === JupyterFrontEndContextMenu.contextMenu
      ) {
        this.contextMenu.menu.close();
        return;
      }
      // Stop propagation and allow the application context menu to show.
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /**
   * Register plugins from a plugin module.
   *
   * @param mod - The plugin module to register.
   */
  registerPluginModule(mod: App.IPluginModule): void {
    let data = mod.default;
    // Handle commonjs exports.
    if (!mod.hasOwnProperty('__esModule')) {
      data = mod as any;
    }
    if (!Array.isArray(data)) {
      data = [data];
    }
    data.forEach((item) => {
      try {
        this.registerPlugin(item);
      } catch (error) {
        this.registerPluginErrors.push(error);
      }
    });
  }

  /**
   * Register the plugins from multiple plugin modules.
   *
   * @param mods - The plugin modules to register.
   */
  registerPluginModules(mods: App.IPluginModule[]): void {
    mods.forEach((mod) => {
      this.registerPluginModule(mod);
    });
  }

  private _contextMenuEvent: MouseEvent;
  private _format: 'desktop' | 'mobile';
  private _formatChanged = new Signal<this, 'desktop' | 'mobile'>(this);
}

/**
 * A namespace for App statics.
 */
export namespace App {
  /**
   * The instantiation options for an App application.
   */
<<<<<<< HEAD
  export type IOptions = Partial<JupyterFrontEnd.IOptions<IShell>>;
=======
  export interface IOptions extends JupyterFrontEnd.IOptions<IShell>, Partial<JupyterLab.IInfo> {};
>>>>>>> f266891 (Adds support for disabling extensions)

  /**
   * The interface for a module that exports a plugin or plugins as
   * the default value.
   */
<<<<<<< HEAD
  export interface IPluginModule {
    /**
     * The default export.
     */
    default: QuetzFrontEndPlugin<any> | QuetzFrontEndPlugin<any>[];
  }
=======
  export type IPluginModule = JupyterLab.IPluginModule;
>>>>>>> f266891 (Adds support for disabling extensions)
}
