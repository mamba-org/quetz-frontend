/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

void (async function bootstrap() {
  let main = (await import('./index.js')).main;
  window.addEventListener('load', main);
})();
