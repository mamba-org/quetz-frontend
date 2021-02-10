import { round } from 'lodash';
import { GB_SIZE, KB_SIZE, MB_SIZE } from './constants';
import { NOTIFICATION_TYPES, sendNotification } from './notification';

export const formatPlural = (count: number, text: string): string =>
  `${count} ${text}${count > 1 ? 's' : ''}`;

export const formatSize = (sizeInBytes: number) => {
  if (sizeInBytes > GB_SIZE) {
    return `${round(sizeInBytes / GB_SIZE, 2)} GB`;
  }
  if (sizeInBytes > MB_SIZE) {
    return `${round(sizeInBytes / MB_SIZE, 2)} MB`;
  }
  if (sizeInBytes > KB_SIZE) {
    return `${round(sizeInBytes / KB_SIZE, 2)} KB`;
  }
  return `${sizeInBytes} bytes`;
};

export const copyToClipboard = (text: string, textType: string): void => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      sendNotification({
        type: NOTIFICATION_TYPES.INFO,
        message: `Copied ${textType && `${textType} `}to clipboard`,
        duration: 3000
      });
    })
    .catch(e => console.error(e));
};

export const getUrlParameter = function getUrlParameter(sParam: string) {
  const sPageURL = window.location.search.substring(1);
  const sURLVariables = sPageURL.split('&');

  for (let i = 0; i < sURLVariables.length; i++) {
    const sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return typeof sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
};
