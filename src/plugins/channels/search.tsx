import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faSearch } from '@fortawesome/free-solid-svg-icons';

class SearchBox extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      input: ''
    };
  }

  updateInput = (e: any) => {
    const { onSearch } = this.props;
    this.setState({
      input: e.target.value
    });
    onSearch(e.target.value);
  };

  onSubmit = () => {
    // TODO
  };

  render(): JSX.Element {
    const { input } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <div className="btn-group">
          <button className="btn btn-default" type="button">
            Filters&emsp;
            <FontAwesomeIcon icon={faCaretDown} />
          </button>
          <input
            className="input search-input"
            value={input}
            type="text"
            onChange={this.updateInput}
            placeholder="Search"
          />
          <button className="btn btn-default" type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </form>
    );
  }
}

export default SearchBox;
