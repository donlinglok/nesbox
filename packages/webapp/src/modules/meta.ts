import { GemElement, html, adoptedStyle, createCSSSheet, css, customElement } from '@mantou/gem';
import { mediaQuery } from '@mantou/gem/helper/mediaquery';

import { i18n } from 'src/i18n';

import 'duoyun-ui/elements/title';
import 'duoyun-ui/elements/reflect';

const style = createCSSSheet(css`
  :host {
    display: none;
  }
`);

@customElement('m-meta')
@adoptedStyle(style)
export class ModuleMetaElement extends GemElement {
  render = () => {
    return html`
      <dy-title suffix=${mediaQuery.isPWA ? '' : ` | ${i18n.get('title')}`}></dy-title>
      <dy-reflect> </dy-reflect>
    `;
  };
}
