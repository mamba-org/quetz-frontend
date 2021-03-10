import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

class SearchBox extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      input: ''
    };
  }

  updateInput = (e: any) => {
    const { onTextUpdate } = this.props;
    this.setState({
      input: e.target.value
    });
    if (onTextUpdate) {
      onTextUpdate(e.target.value);
    }
  };

  onSubmit = (e: any) => {
    const { onSubmit } = this.props;
    const { input } = this.state;
    e.preventDefault();
    if (onSubmit) {
      onSubmit(input);
    }
  };

  render(): JSX.Element {
    const { input } = this.state;
    const { onSubmit } = this.props;

    return (
      <form onSubmit={this.onSubmit}>
        <div className="btn-group">
          <input
            className="input search-input"
            value={input}
            type="text"
            onChange={this.updateInput}
            placeholder="Search"
          />
          {onSubmit && (
            <button className="btn btn-default" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          )}
        </div>
      </form>
    );
  }
}

export default SearchBox;
