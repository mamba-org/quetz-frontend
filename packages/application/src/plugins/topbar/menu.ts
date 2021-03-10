import { IMainMenu } from './tokens';

import { ArrayExt } from '@lumino/algorithm';

import { Widget, Panel } from '@lumino/widgets';

import { Message, MessageLoop, IMessageHandler } from '@lumino/messaging';

/**
 * The main menu.
 */
export class MainMenu extends Panel implements IMainMenu {
  /**
   * Construct the main menu bar.
   */
  constructor() {
    super();
    this.id = 'main-menu';
    this.addClass('topbar-item');
    MessageLoop.installMessageHook(this, this._panelChildHook);
  }

  public addItem(widget: Widget, rank: number): void {
    widget.parent = null;
    widget.addClass('topbar-item-content');
    const item = { widget, rank };
    const index = ArrayExt.upperBound(this._items, item, Private.itemCmp);
    ArrayExt.insert(this._items, index, item);
    this.insertWidget(index, widget);
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
          if (this._items.find(v => v.widget === widget)) {
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
          ArrayExt.removeFirstWhere(this._items, v => v.widget === widget);
        }
        break;
      default:
        break;
    }
    return true;
  };

  private _items = new Array<Private.IRankItem>();
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
}
