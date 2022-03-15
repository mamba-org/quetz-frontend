import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faSearch } from '@fortawesome/free-solid-svg-icons';

import * as React from 'react';
import { Button, Search } from '@jupyter-notebook/react-components';

/**
 * Search box properties
 */
export interface ISearchBoxProps {
  /**
   * Callback on search term submission
   */
  onSubmit: (input: string) => void;
}

export class SearchBox extends React.PureComponent<ISearchBoxProps> {
  constructor(props: ISearchBoxProps) {
    super(props);
    this._searchRef = React.createRef();
  }

  render(): JSX.Element {
    return (
      <form
        onSubmit={(event: React.FormEvent) => {
          event.preventDefault();
          const value = (this._searchRef.current as any)?.value;

          if (value) {
            (this._searchRef.current! as any).value = '';
            this.props.onSubmit(value);
          }
        }}
      >
        <div className="btn-group">
          <Search ref={this._searchRef} placeholder="Search"></Search>
          <Button appearance="neutral" type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </div>
      </form>
    );
  }

  private _searchRef: React.RefObject<HTMLElement>;
}
