import { LabIcon } from '@jupyterlab/ui-components';
import * as avatar_icon from '../style/img/avatar-icon.svg';
import * as quetz_logo from '../style/img/quetz-logo.svg';
import * as bars_icon from '../style/img/bars-solid.svg';

/**
 * An anonymous avatar icon
 */
export const avatarIcon = new LabIcon({
  name: 'avatar_icon',
  svgstr: avatar_icon.default,
});

export const hamburgerIcon = new LabIcon({
  name: 'hamburger',
  svgstr: bars_icon.default,
});

/**
 * Quetz logo
 */
export const quetzIcon = new LabIcon({
  name: 'quetz_logo',
  svgstr: quetz_logo.default,
});
