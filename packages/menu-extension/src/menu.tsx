import { Avatar, Button } from '@jupyter-notebook/react-components';
import { IRouter } from '@jupyterlab/application';
import { ReactWidget, UseSignal } from '@jupyterlab/apputils';
import { IRankedMenu, MenuSvg, RankedMenu } from '@jupyterlab/ui-components';
import { JSONExt } from '@lumino/coreutils';
import { ISignal, Signal } from '@lumino/signaling';
import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';
import { IMenu, Profile } from '@quetz-frontend/menu';
import * as React from 'react';
import { avatarIcon } from './icons';

namespace CommandIDs {
  /**
   * Login using a given provider
   */
  export const login = '@quetz-frontend/menu-extension:login';
  /**
   * Logout the current user
   */
  export const logout = '@quetz-frontend/menu-extension:logout';
}

/**
 * The menu plugin.
 */
export const menu: QuetzFrontEndPlugin<IMenu> = {
  id: '@quetz-frontend/menu-extension:menu',
  autoStart: true,
  requires: [IRouter],
  provides: IMenu,
  activate: activateMenu,
};

/**
 * Main menu
 */
class MainMenu extends RankedMenu implements IMenu {
  constructor(options: IRankedMenu.IOptions) {
    super(options);

    // Insert fake separator after sign in message
    this.node.insertAdjacentHTML(
      'afterbegin',
      '<div class="lm-Menu-item" data-type="separator" style="display: inline;"><div></div></div>'
    );
    this._messageNode = document.createElement('span');
    this._messageNode.textContent = 'Not signed in';
    this.node.insertAdjacentElement('afterbegin', this._messageNode);

    (async () => {
      const config_data = document.getElementById('jupyter-config-data');
      if (config_data) {
        try {
          const data = JSON.parse(config_data.innerHTML);
          if (data.detail) {
            console.error(data.detail);
            return;
          }
          if (data.logged_in_user_profile) {
            this.setProfile(JSON.parse(data.logged_in_user_profile));
          } else {
            try {
              const response = await fetch('/api/me');
              const payload = await response.json();

              if (payload.detail) {
                console.error(payload.detail);
              } else {
                this.setProfile(payload);
              }
            } catch (reason) {
              console.error('Fail to get user profile.', reason);
            }
          }
        } catch (e) {
          console.log("Couldn't parse configuration object.", e);
        }
      }
    })();
  }

  /**
   * Logged user profile.
   */
  get profile(): Profile | null {
    return this._profile;
  }

  /**
   * User profile changed signal.
   */
  get profileChanged(): ISignal<IMenu, Profile | null> {
    return this._profileChanged;
  }

  protected setProfile(v: Profile | null) {
    if (!JSONExt.deepEqual(this.profile, v)) {
      this._profile = v;
      this._messageNode.textContent = this.profile
        ? `Signed in as ${this.profile.user.username}`
        : 'Not signed in';
      this._profileChanged.emit(this.profile);
    }
  }

  private _messageNode: HTMLSpanElement;
  private _profile: Profile | null = null;
  private _profileChanged: Signal<IMenu, Profile | null> = new Signal<
    MainMenu,
    Profile | null
  >(this);
}

/**
 * A concrete implementation of a help menu.
 */
export class MenuButton extends ReactWidget {
  constructor(private _menu: MainMenu) {
    super();
    this.id = 'login-menu';
    this.addClass('topbar-item');
  }

  private _onClick = (): void => {
    const { left, bottom } = this.node.getBoundingClientRect();
    this._menu.open(left, bottom, { forceY: true });
  };

  render(): React.ReactElement {
    return (
      <UseSignal signal={this._menu.profileChanged}>
        {() => {
          const isAnonymous = !this._menu.profile;
          const profile = this._menu.profile ?? {
            name: 'Anonymous',
            avatar_url: '',
          };
          return (
            <div>
              <Button
                appearance="stealth"
                aria-label={`User Menu: ${profile.name}`}
                onClick={this._onClick}
              >
                {isAnonymous ? (
                  <avatarIcon.react
                    className="anonymous-icon"
                    tag="span"
                    width="28px"
                    height="28px"
                  />
                ) : (
                  <Avatar
                    src={profile.avatar_url}
                    shape="circle"
                    alt={`${profile.name.slice(0, 2).toLocaleUpperCase()}`}
                  ></Avatar>
                )}
              </Button>
            </div>
          );
        }}
      </UseSignal>
    );
  }
}

/**
 * @param app Application object
 * @returns The application menu object
 */
function activateMenu(app: QuetzFrontEnd): IMenu {
  // Add menu
  const menu = new MainMenu({
    commands: app.commands,
    renderer: MenuSvg.defaultRenderer,
  });
  menu.addClass('quetz-main-menu');
  const menuButton = new MenuButton(menu);

  // Add commands
  app.commands.addCommand(CommandIDs.login, {
    label: (args) => `Sign in with ${args.provider}`,
    isEnabled: (args) => !!args.provider && !!args.api,
    isVisible: () => menu.profile === null,
    execute: (args) => {
      if (args.api) {
        window.location.href = `/auth/${args.api}/login`;
      }
    },
  });

  app.commands.addCommand(CommandIDs.logout, {
    label: 'Sign out',
    isVisible: () => menu.profile !== null,
    execute: () => {
      window.location.href = '/auth/logout';
    },
  });

  app.shell.add(menuButton, 'top', { rank: 100 });

  menu.addItem({ type: 'separator', rank: 500 });
  menu.addItem({ type: 'separator', rank: 1000 });
  menu.addItem({
    command: CommandIDs.logout,
    rank: 1001,
  });

  return menu;
}
