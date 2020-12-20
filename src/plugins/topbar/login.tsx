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
		console.debug("items", this._items);
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
			// If the active element exists and is clicked outside of
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				console.debug("click", dropdownRef);
				setIsActive(!isActive);
			}
		};

		// If the item is active (ie open) then listen for clicks outside
		if (isActive) {
			window.addEventListener("click", onClick);
		}

		return () => {
			window.removeEventListener("click", onClick);
		};
	}, [isActive, dropdownRef]);

	const onClick = () => setIsActive(!isActive);
	const logIn = (api: string) => {
		window.location.href = api;//'/auth/github/login';
	};

	console.log("active", isActive, dropdownRef);
  return (
    <div className="container">
				<div className="menu-container">
					{ profile ?
						<button onClick={onClick} className="menu-trigger">
							<span>{profile.user.username}</span>
							<img
								src={profile.avatar_url}
								alt="avatar"
							/>
						</button>
						:
						<button onClick={onClick} className="menu-trigger">
							<span>LogIn</span>
						</button>
					}
					<div
						ref={dropdownRef}
						className={`menu ${isActive ? "active" : "inactive"}`}
					>
						<ul>
							{ 
								items.map( value => {
									return (
										<li key={value.id}>
											<a href="#" onClick={() => logIn(value.api)}>
												{value.label}
											</a>
										</li>
									);
								})
							}
						</ul>
					</div>
				</div>
			</div>
  );
}