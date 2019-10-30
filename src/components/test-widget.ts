import { KndWidgetBase } from "./knd-widget-base";
import { customElement, html } from "lit-element";

import './knd-small';

import '@material/mwc-icon';

import { loadMaterialFonts } from "../util/font-loader";

@customElement('test-widget')
export class TestWidget extends KndWidgetBase {

  renderTiny() {
    loadMaterialFonts();

    return html`
      <mwc-icon>warning</mwc-icon>
    `;
  }

  renderSmall() {
    loadMaterialFonts();

    return html`
      <mwc-icon slot="icon">warning</mwc-icon>
      <div slot="label">Test Widget</div>
    `;
  }

  renderMedium() {
    return html``;
  }

  renderLarge() {
    return html``;
  }
};