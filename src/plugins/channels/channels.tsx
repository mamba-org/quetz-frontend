import { ReactWidget } from '@jupyterlab/apputils';

import * as React from 'react';

export type Channel = {
  name: string,
  description: string,
  private: boolean,
  size_limit: number,
  mirror_channel_url: string,
  mirror_mode: string
};

/**
 * A concrete implementation of a help menu.
 */
export class Channels extends ReactWidget {
  constructor() {
    super();
    this.id = 'main-channels';
  }

  onAfterAttach = () => {
    fetch('/api/channels')
      .then( async response => {
        const data = await response.json();
        console.debug(data);
        if ('detail' in data) return;
        this._channels = data;
        this.update();
      }).catch( e => console.warn(e));
    this.update();
  };

  render(): React.ReactElement {
    console.debug("Channels");
    console.debug(this._channels);
    if (this._channels) {
      return (
        <div>
          <ul>
            {this._channels.map((value, index) => {
              return (
                <li key={index}>
                  <span>{value.name}</span>
                  <span>{value.description}</span>
                  <span>{value.private}</span>
                  <span>{value.size_limit}</span>
                  <span>{value.mirror_channel_url}</span>
                  <span>{value.mirror_mode}</span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    } else {
      return (<div>No channels</div>)
    }
  }

  private _channels: Channel[];
}
