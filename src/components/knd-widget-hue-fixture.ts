import { customElement, LitElement, html, property, css, query } from "lit-element";
import { radius1x, size2x, size25x, fontSize1x } from '../util/base-styles';

import {Switch} from '@material/mwc-switch';

import '@material/mwc-switch';
import '@material/mwc-slider';

export interface SwitchedEv {
  on: boolean;
}

@customElement('knd-widget-hue-fixture')
export class KndWidgetHueFixture extends LitElement {
  @query('#switch') switch!: Switch | null;

  @property({type: String}) name = '';
  @property({type: Boolean, reflect: true, attribute: 'on'}) on = false;
  @property({type: Number}) brightness = 0;
  @property({type: Number}) hue = 0;

  static get styles() {
    return css`
      #topLine {
        display: flex;
        align-items: center;
        margin-bottom: ${size2x};
      }

      #name {
        flex-grow: 1;
        font-size: calc(${fontSize1x} * 1.5)
      }

      :host {
        border-radius: ${radius1x};
        padding: ${size2x};
        min-width: ${size25x};

        transition: color .2s, background-color .2s;
      }

      :host([on]) {
        background-color: var(--knd-theme-on-surface);
        --mdc-theme-secondary: var(--knd-theme-primary);
        color: var(--knd-theme-on-on-surface);
      }

      :host(:not([on])) {
        background-color: hsl(calc(var(--knd-theme-surface-h) + 1deg), calc(var(--knd-theme-surface-s) - 1%), calc(var(--knd-theme-surface-l) + 27%));
        color: var(--knd-theme-on-surface);
        --mdc-theme-secondary: var(--knd-theme-secondary);
      }

      .sliderWrapper {
        width: 90%;
        margin: 0 auto;
      }

      mwc-slider {
        width: 100%;
      }
    `;
  }

  render() {
    return html`
      <div id="topLine">
        <span id="name">${this.name}</span>
        <mwc-switch
            id="switch"
            .checked=${this.on}
            @change=${this.onSwitchChange}>
        </mwc-switch>
      </div>
      <div id="controls">
        <div class="control">
          <div class="title">Brightness</div>
          <div class="sliderWrapper">
            <mwc-slider .value=${this.brightness}></mwc-slider>
          </div>
        </div>
        <div class="control">
          <div class="title">Hue</div>
          <div class="sliderWrapper">
            <mwc-slider .value=${this.hue}></mwc-slider>
          </div>
        </div>
      </div>
    `;
  }

  protected onSwitchChange() {
    const switchEl = this.switch;

    if (!switchEl) {
      return;
    }

    this.on = switchEl.checked;
  }
}