import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faTimes,
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

import clsx from 'clsx';

import { Store } from 'react-notifications-component';

import * as React from 'react';

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  DANGER: 'danger',
  INFO: 'info',
  DEFAULT: 'default',
  WARNING: 'warning',
};

const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.SUCCESS]: faCheckCircle,
  [NOTIFICATION_TYPES.DANGER]: faTimesCircle,
  [NOTIFICATION_TYPES.INFO]: faInfoCircle,
  [NOTIFICATION_TYPES.DEFAULT]: faInfoCircle,
  [NOTIFICATION_TYPES.WARNING]: faExclamationCircle,
};

class NotificationComponent extends React.PureComponent<any, any> {
  render() {
    const { id, type, title, message } = this.props;
    return (
      <div className="notification-item">
        <p className={clsx('notification-icon', type)}>
          <FontAwesomeIcon icon={NOTIFICATION_ICONS[type]} />
        </p>
        <div className="notification-content">
          {title && <p className={clsx('notification-title', type)}>{title}</p>}
          {message && <p className="notification-message">{message}</p>}
        </div>
        <button className="notification-close">
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => Store.removeNotification(id)}
          />
        </button>
      </div>
    );
  }
}

export const sendNotification = ({
  type = NOTIFICATION_TYPES.DEFAULT,
  title,
  message,
  duration,
}: any) => {
  const notifId = Store.addNotification({
    content: ({ id }: any) =>
      (
        <NotificationComponent
          id={id}
          title={title}
          type={type}
          message={message}
        />
      ) as any,
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration,
    },
  });

  // TODO: Find out why the notifiaction is not automatically disappearing
  if (duration) {
    setTimeout(() => {
      Store.removeNotification(notifId);
    }, duration);
  }
};
