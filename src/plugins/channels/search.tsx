import React from 'react';
// import * as caret_icon from '../../../style/img/caret-down.svg';

class SearchBox extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      input: ''
    };
  }

  updateInput = (e: any) => {
    this.setState({
      input: e.target.value
    });
  };

  render(): JSX.Element {
    const { input } = this.state;
    return (
      <div className="search-wrapper btn-group">
        <button className="btn btn-default">Filters</button>
        <input
          className="input search-input"
          value={input}
          type="text"
          onChange={this.updateInput}
          placeholder="from:RoboStack is:linux-64"
        />
      </div>
    );
  }
}

export default SearchBox;
