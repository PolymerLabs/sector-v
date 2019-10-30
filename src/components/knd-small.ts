import { customElement, LitElement, html, css } from "lit-element";
import { size1x } from "../util/base-styles";

import '@material/mwc-ripple';

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

      slot[name="icon"]::slotted(*) {
        flex-grow: 0;
      }

      slot[name="label"]::slotted(*) {
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
      </div>
    `;
  }
}