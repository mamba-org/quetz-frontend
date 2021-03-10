import * as React from 'react';

class InlineLoader extends React.PureComponent<any, any> {
  render() {
    const { text } = this.props;
    return (
      <div className="loader-wrapper padding">
        <div className="loader" />
        {text && <p className="text loader-text">{text}</p>}
      </div>
    );
  }
}

export default InlineLoader;
