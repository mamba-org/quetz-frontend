import { ProgressRing } from '@jupyter-notebook/react-components';
import * as React from 'react';

export class InlineLoader extends React.PureComponent<{ text?: string }> {
  render() {
    const { text } = this.props;
    return (
      <div className="loader-wrapper padding">
        <ProgressRing></ProgressRing>
        {text && <p className="text loader-text">{text}</p>}
      </div>
    );
  }
}
