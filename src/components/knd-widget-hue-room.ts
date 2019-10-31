import { customElement, LitElement, html, property, css } from "lit-element";

import '@material/mwc-checkbox';
import { size1x, size2x, fontSize2x } from "../util/base-styles";

@customElement('knd-widget-hue-room')
export class KndWidgetHueFixture extends LitElement {
  @property({type: String}) name = '';

  static get styles() {
    return css`
      :host {
        display: block;
      }

      #fixtures {
        display: flex;
        overflow-x: scroll;
        flex-direction: row;
        margin-left: calc(${size2x} * -1);
        margin-right: calc(${size2x} * -1);
        padding-left: ${size2x};
        padding-right: ${size2x};
      }

      #fixtures ::slotted(*) {
        margin-right: ${size1x};
      }

      #name {
        font-size: ${fontSize2x};
        margin: ${size1x} 0;
      }
    `;
  }

  render() {
    return html`
      <div id="name">${this.name}</div>
      <div id="fixtures">
        <slot></slot>
      </div>
    `;
  }
}