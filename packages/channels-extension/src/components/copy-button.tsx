import { faCopy } from '@fortawesome/free-solid-svg-icons';

import { SizeProp } from '@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as React from 'react';

type CopyButtonProps = {
  copyText: string;
  size?: SizeProp;
}

/**
 * A button to copy a text to clipboard.
 */
const CopyButton = (props: CopyButtonProps) => {

  const [shake, setShake] = React.useState(false);

  /**
   * Animation of the icon when clicked.
   */
  const animate = () => {
    setShake(true);
    setTimeout(() => setShake(false), 1000);
  }

  return(
    <FontAwesomeIcon className={'copy-button' + (props.size ? ` fa-${props.size}` : '') + (shake ? ' shake' : '')}
      icon={faCopy}
      onClick={() => {
        animate();
        navigator.clipboard.writeText(props.copyText);
      }}
    />
  );

}

export default CopyButton;
