import { ReactWidget } from '@jupyterlab/apputils';

import React, { useEffect, useState, useRef } from 'react';

import { ILogInMenu, LogInItem } from './tokens';

export type Profile = {
  name:	string,
  avatar_url:	string,
  user:	{
    id:	string,
    username:	string
  }
};

type Props = {
	profile: Profile,
	items: LogInItem[],
}

/**
 * A concrete implementation of a help menu.
 */
export class LogInMenu extends ReactWidget implements ILogInMenu {
  constructor() {
    super();
    // TODO logout, show google login
		this.id = 'login-menu';
		this.addClass("topbar-item");
	}
	
	onAfterAttach = () => {
    fetch('/api/me')
      .then( async response => {
        const data = await response.json();
        if ('detail' in data) return;
        this._profile = data;
        this.update();
      }).catch( e => console.warn(e));
    this.update();
  };

  public addItem(item: LogInItem): void {
		this._items.push(item);
		this.update();
  }

  render(): React.ReactElement {
		return (
			<DropDownMenu profile={this._profile} items={this._items} />
		);
	}
	
	private _profile: Profile;
  private _items = new Array<LogInItem>();
}

const DropDownMenu = ({ profile, items }: Props): JSX.Element => {
  const dropdownRef = useRef<HTMLDivElement>(null);
	const [ isActive, setIsActive ] = useState(false);

	useEffect(() => {
		const onClick = (e: Event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setIsActive(!isActive);
			}
		};

		if (isActive) {
			window.addEventListener("click", onClick);
		}

		return () => {
			window.removeEventListener("click", onClick);
		};
	}, [isActive, dropdownRef]);

	const onClick = () => setIsActive(!isActive);
	const logIn = (api: string) => {
		console.debug(api);
		window.location.href = '/auth/github/login';
	};

	if (profile) {
		return (
			<div>
				<a onClick={onClick}>
						<img
							className="user-img"
							src={profile.avatar_url}
							alt="avatar"
						/>
					</a>
				<div
					ref={dropdownRef}
					className={`login-menu ${isActive ? "active" : "inactive"}`}
				>
					<ul>
						<li key={profile.name}>
							<a><span>Signed in as {profile.user.username}</span></a>
						</li>
						<hr/>
						{ 
							items.map( value => {
								if (value.loggedIn) {
									return (
										<li key={value.id}>
											<a onClick={() => logIn(value.api)} >
												<span>{value.label}</span>
											</a>
										</li>
									);
								}
							})
						}
						<hr/>
						<li key={profile.name}>
							<a onClick={() => logIn('/auth/github/login')}>
								<span>Sign out</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<a onClick={onClick}>
					<span>LogIn</span>
				</a>
				<div
					ref={dropdownRef}
					className={`login-menu ${isActive ? "active" : "inactive"}`}
				>
					<ul>
						{ 
							items.map( value => {
								if (!value.loggedIn) {
									return (
										<li key={value.id}>
											<a onClick={() => logIn(value.api)} >
												<span>{value.label}</span>
											</a>
										</li>
									);
								}
							})
						}
					</ul>
				</div>
			</div>
		);
	}
}