import { round } from 'lodash';
import { GB_SIZE, KB_SIZE, MB_SIZE } from './constants';

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
