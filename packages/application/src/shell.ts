import { JupyterFrontEnd } from '@jupyterlab/application';

import type { DocumentRegistry } from '@jupyterlab/docregistry';

import { classes, LabIcon } from '@jupyterlab/ui-components';

import { ArrayExt, IIterator, iter } from '@lumino/algorithm';

import { Panel, Widget, BoxLayout } from '@lumino/widgets';

import { Message, MessageLoop, IMessageHandler } from '@lumino/messaging';

export type IShell = Shell;

/**
 * A namespace for Shell statics
 */
export namespace IShell {
  /**
   * The areas of the application shell where widgets can reside.
   */
  export type Area = 'main' | 'top';
}

/**
 * The default rank for ranked panels.
 */
const DEFAULT_RANK = 900;

/**
 * The application shell.
 */
export class Shell extends Widget implements JupyterFrontEnd.IShell {
  constructor() {
    super();
    this.id = 'main';
    const rootLayout = new BoxLayout();

    this._top = new Private.PanelHandler();
    this._main = new Panel();

    this._top.panel.id = 'top-panel';
    this._main.id = 'main-panel';

    BoxLayout.setStretch(this._top.panel, 0);
    BoxLayout.setStretch(this._main, 1);

    // this._main.spacing = 5;

    rootLayout.spacing = 0;
    rootLayout.addWidget(this._top.panel);
    rootLayout.addWidget(this._main);

    this.layout = rootLayout;
  }

  activateById(id: string): void {
    // no-op
  }

  /**
   * Add a widget to the application shell.
   *
   * @param widget - The widget being added.
   * @param area - Optional region in the shell into which the widget should
   * be added.
   * @param options
   */
  add(
    widget: Widget,
    area?: IShell.Area,
    options?: DocumentRegistry.IOpenOptions
  ): void {
    const rank = options?.rank ?? DEFAULT_RANK;
    if (area === 'top') {
      return this._top.addWidget(widget, rank);
    }
    if (area === 'main' || area === undefined) {
      // if (this._main.widgets.length > 0) {
      //   // do not add the widget if there is already one
      //   return;
      // }
      this._addToMainArea(widget);
    }
    return;
  }

  /**
   * The current widget in the shell's main area.
   */
  get currentWidget(): Widget {
    // TODO: use a focus tracker to return the current widget
    return this._main.widgets[0];
  }

  /**
   * Get the top area wrapper panel
   */
  get top(): Widget {
    return this._topWrapper;
  }

  widgets(area: IShell.Area): IIterator<Widget> {
    if (area === 'top') {
      return iter(this._top.panel.widgets);
    }
    return iter(this._main.widgets);
  }

  /**
   * Add a widget to the main content area.
   *
   * @param widget The widget to add.
   */
  private _addToMainArea(widget: Widget): void {
    if (!widget.id) {
      console.error(
        'Widgets added to the app shell must have unique id property.'
      );
      return;
    }

    const dock = this._main;

    const { title } = widget;
    title.dataset = { ...title.dataset, id: widget.id };

    if (title.icon instanceof LabIcon) {
      // bind an appropriate style to the icon
      title.icon = title.icon.bindprops({
        stylesheet: 'mainAreaTab',
      });
    } else if (typeof title.icon === 'string' || !title.icon) {
      // add some classes to help with displaying css background imgs
      title.iconClass = classes(title.iconClass, 'jp-Icon');
    }
    if (dock.widgets.length) {
      dock.widgets[0].dispose();
    }
    dock.addWidget(widget);
  }

  private _main: Panel;
  private _top: Private.PanelHandler;
  private _topWrapper: Panel;
}

namespace Private {
  /**
   * An object which holds a widget and its sort rank.
   */
  export interface IRankItem {
    /**
     * The widget for the item.
     */
    widget: Widget;

    /**
     * The sort rank of the widget.
     */
    rank: number;
  }
  /**
   * A less-than comparison function for side bar rank items.
   *
   * @param first
   * @param second
   */
  export function itemCmp(first: IRankItem, second: IRankItem): number {
    return first.rank - second.rank;
  }

  /**
   * A class which manages a panel and sorts its widgets by rank.
   */
  export class PanelHandler {
    constructor() {
      MessageLoop.installMessageHook(this._panel, this._panelChildHook);
    }

    /**
     * Get the panel managed by the handler.
     */
    get panel(): Panel {
      return this._panel;
    }

    /**
     * Add a widget to the panel.
     *
     * If the widget is already added, it will be moved.
     *
     * @param widget
     * @param rank
     */
    addWidget(widget: Widget, rank: number): void {
      widget.parent = null;
      const item = { widget, rank };
      const index = ArrayExt.upperBound(this._items, item, Private.itemCmp);
      ArrayExt.insert(this._items, index, item);
      this._panel.insertWidget(index, widget);
    }

    /**
     * A message hook for child add/remove messages on the main area dock panel.
     *
     * @param handler
     * @param msg
     */
    private _panelChildHook = (
      handler: IMessageHandler,
      msg: Message
    ): boolean => {
      switch (msg.type) {
        case 'child-added':
          {
            const widget = (msg as Widget.ChildMessage).child;
            // If we already know about this widget, we're done
            if (this._items.find((v) => v.widget === widget)) {
              break;
            }

            // Otherwise, add to the end by default
            const rank = this._items[this._items.length - 1].rank;
            this._items.push({ widget, rank });
          }
          break;
        case 'child-removed':
          {
            const widget = (msg as Widget.ChildMessage).child;
            ArrayExt.removeFirstWhere(this._items, (v) => v.widget === widget);
          }
          break;
        default:
          break;
      }
      return true;
    };

    private _items = new Array<Private.IRankItem>();
    private _panel = new Panel();
  }
}
