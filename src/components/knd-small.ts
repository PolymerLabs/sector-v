import { customElement, LitElement, html, css } from 'lit-element';
import { size1x } from '../util/base-styles';

import '@material/mwc-ripple';
import '@material/mwc-icon';

@customElement('knd-small')
export class KndSmall extends LitElement {
  static get styles() {
    return css`
      :host {
        width: 100%;
      }

      #wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      slot[name='icon']::slotted(*) {
        flex-grow: 0;
      }

      slot[name='label']::slotted(*) {
        flex-grow: 1;
        margin-left: ${size1x};
      }
    `;
  }

  render() {
    return html`
      <div id="wrapper">
        <slot name="icon"></slot>
        <slot name="label"></slot>
        <span
          @touchstart=${this.stopRipple}
          @pointerdown=${this.stopRipple}
          @mousedown=${this.stopRipple}
          @keydown=${this.stopRipple}
          @click=${this.removeClicked}
        >
          <mwc-icon>clear</mwc-icon>
          <mwc-ripple primary unbounded></mwc-ripple>
        </span>
      </div>
    `;
  }

  stopRipple(e: MouseEvent) {
    e.stopPropagation();
  }

  removeClicked(e: MouseEvent) {
    e.stopPropagation();
    const removeClick = new Event('remove-click');
    this.dispatchEvent(removeClick);
  }
}
