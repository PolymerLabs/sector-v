import { customElement, html, css } from "lit-element";
import { KndWidgetBase } from "./knd-widget-base";

import '@material/mwc-icon';
import './knd-widget-hue-room';
import './knd-widget-hue-fixture';

import { loadMaterialFonts } from "../util/font-loader";
import { fontSize3x } from "../util/base-styles";

@customElement('knd-widget-hue')
export class KndWidgetHue extends KndWidgetBase {
  static get styles() {
    const styles = css`
      :host {
        --knd-theme-primary-h: 45deg;
        --knd-theme-primary-s: 97%;
        --knd-theme-primary-l: 60%;
        --knd-theme-primary: hsl(var(--knd-theme-primary-h), var(--knd-theme-primary-s), var(--knd-theme-primary-l));
        --mdc-theme-primary: var(--knd-theme-primary);

        --knd-theme-secondary-h: 214deg;
        --knd-theme-secondary-s: 82%;
        --knd-theme-secondary-l: 51%;
        --knd-theme-secondary: hsl(var(--knd-theme-secondary-h), var(--knd-theme-secondary-s), var(--knd-theme-secondary-l));
        --mdc-theme-secondary: var(--knd-theme-secondary);


        --knd-theme-surface-h: 206deg;
        --knd-theme-surface-s: 6%;
        --knd-theme-surface-l: 25%;
        --knd-theme-surface: hsl(var(--knd-theme-surface-h), var(--knd-theme-surface-s), var(--knd-theme-surface-l));


        --knd-theme-on-surface-h: 0deg;
        --knd-theme-on-surface-s: 0%;
        --knd-theme-on-surface-l: 100%;
        --knd-theme-on-surface: hsl(var(--knd-theme-on-surface-h), var(--knd-theme-on-surface-s), var(--knd-theme-on-surface-l));

        --knd-theme-on-on-surface-h: 225deg;
        --knd-theme-on-on-surface-s: 6%;
        --knd-theme-on-on-surface-l: 13%;
        --knd-theme-on-on-surface: hsl(var(--knd-theme-on-on-surface-h), var(--knd-theme-on-on-surface-s), var(--knd-theme-on-on-surface-l));

        color: var(--knd-theme-on-surface);
      }

      #knd-widget-base-wrapper {
        background-color: var(--knd-theme-surface);
      }

      #title {
        font-size: ${fontSize3x};
      }
    `;

    if (Array.isArray(super.styles)) {
      return [...super.styles, styles];
    }

    return [super.styles, styles];
  }

  connectedCallback() {
    super.connectedCallback();
    loadMaterialFonts();
  }

  renderTiny() {
    return html`<mwc-icon>emoji_objects</mwc-icon>`
  }

  renderSmall() {
    return html`
      <mwc-icon slot="icon">emoji_objects</mwc-icon>
      <div slot="label">Huey</div>
    `;
  }

  renderMedium() {
    return html`
      <div id="title">Lights</div>
      <knd-widget-hue-room name="Living Room">
        <knd-widget-hue-fixture
            name="Lamp"
            on
            brightness="100"
            hue="0">
        </knd-widget-hue-fixture>
        <knd-widget-hue-fixture
            name="Table"
            on
            brightness="100"
            hue="100">
        </knd-widget-hue-fixture>
        <knd-widget-hue-fixture
            name="Mirror"
            brightness="100"
            hue="100">
        </knd-widget-hue-fixture>
        <knd-widget-hue-fixture
            name="Wall"
            brightness="100"
            hue="77">
        </knd-widget-hue-fixture>
      </knd-widget-hue-room>
      <knd-widget-hue-room name="Kitchen">
      <knd-widget-hue-fixture
            name="Ceiling"
            brightness="100"
            hue="0">
        </knd-widget-hue-fixture>
        <knd-widget-hue-fixture
            name="Fridge Interior"
            on
            brightness="100"
            hue="100">
        </knd-widget-hue-fixture>
        <knd-widget-hue-fixture
            name="Counter"
            brightness="45"
            hue="16">
        </knd-widget-hue-fixture>
      </knd-widget-hue-room>
      <knd-widget-hue-room name="Bedroom">
        <knd-widget-hue-fixture
            name="Lamp"
            on
            brightness="100"
            hue="0">
        </knd-widget-hue-fixture>
        <knd-widget-hue-fixture
            name="Table"
            brightness="100"
            hue="100">
        </knd-widget-hue-fixture>
        <knd-widget-hue-fixture
            name="Mirror"
            brightness="100"
            hue="100">
        </knd-widget-hue-fixture>
        <knd-widget-hue-fixture
            name="Wall"
            on
            brightness="100"
            hue="77">
        </knd-widget-hue-fixture>
      </knd-widget-hue-room>
      <knd-widget-hue-room name="Game Room">
        <knd-widget-hue-fixture
            name="Lamp"
            brightness="100"
            hue="0">
        </knd-widget-hue-fixture>
      </knd-widget-hue-room>
    `;
  }

  renderLarge() {
    return this.renderMedium();
  }
}