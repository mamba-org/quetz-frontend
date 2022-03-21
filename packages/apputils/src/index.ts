import {
  accentColor,
  SwatchRGB,
  addJupyterLabThemeChangeListener,
  bodyFont,
} from '@jupyter-notebook/web-components';

// Set default design token value
bodyFont.withDefault('"Open Sans", sans-serif');
accentColor.withDefault(SwatchRGB.from({ r: 242, g: 240, b: 18 }));

export * from './breadcrumbs';
export * from './constants';
export * from './fetch-hoc';
export * from './loader';
export * from './notification';
export * from './search';
export * from './utils';

addJupyterLabThemeChangeListener();
