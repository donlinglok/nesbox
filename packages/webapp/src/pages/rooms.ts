import { html, adoptedStyle, customElement, createCSSSheet, css, connectStore, GemElement } from '@mantou/gem';
import { polling } from 'duoyun-ui/lib/utils';
import { mediaQuery } from '@mantou/gem/helper/mediaquery';

import { getRooms } from 'src/services/api';
import { store } from 'src/store';
import { i18n } from 'src/i18n';
import { icons } from 'src/icons';
import { theme } from 'src/theme';

import 'duoyun-ui/elements/result';
import 'src/modules/game-list';
import 'src/modules/room-list';
import 'src/modules/lobby-chat';

const style = createCSSSheet(css`
  :host {
    display: block;
    min-height: 100vh;
    padding-inline: ${theme.gridGutter};
  }
  dy-divider {
    margin-block-end: ${theme.gridGutter};
  }
  .chat {
    position: fixed;
    right: ${theme.gridGutter};
    bottom: ${theme.gridGutter};
  }
`);

@customElement('p-rooms')
@adoptedStyle(style)
@connectStore(store)
@connectStore(i18n.store)
export class PRoomsElement extends GemElement {
  mounted = () => {
    this.effect(
      () => polling(getRooms, 7_000),
      () => [i18n.currentLanguage],
    );
  };

  render = () => {
    return html`
      <dy-divider></dy-divider>
      ${store.roomIds?.length === 0
        ? html`
            <dy-result style="height: 60vh" .illustrator=${icons.empty} .header=${i18n.get('notDataTitle')}></dy-result>
          `
        : html`<m-room-list></m-room-list>`}
      ${!mediaQuery.isPhone ? html`<m-lobby-chat class="chat"></m-lobby-chat>` : ''}
    `;
  };
}
