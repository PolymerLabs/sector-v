import {LitElement, customElement, html, css, property} from 'lit-element';

import './test-widget';
import { WidgetSize } from '../util/types';

import '@material/mwc-button';
import { size100x, size1x } from '../util/base-styles';
@customElement('knd-app')
export class KndApp extends LitElement {
  @property({type: String}) size: WidgetSize = 'large';

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;

        --knd-theme-primary: hsl(var(--knd-theme-primary-h), var(--knd-theme-primary-s), var(--knd-theme-primary-l));
        --mdc-theme-primary: var(--knd-theme-primary);

        --knd-theme-surface: hsl(calc(var(--knd-theme-primary-h) - 4deg), calc(var(--knd-theme-primary-s) - 33%), calc(var(--knd-theme-primary-l) + 67%));
        --mdc-theme-surface: var(--knd-theme-surface);

        --knd-theme-on-surface: hsl(calc(var(--knd-theme-primary-h) - 2deg), calc(var(--knd-theme-primary-s) - 59%), calc(var(--knd-theme-primary-l) + 42%));
        --mdc-theme-on-surface: var(--knd-theme-on-surface);


        --knd-theme-secondary-h: 31deg;
        --knd-theme-secondary-s: 100%;
        --knd-theme-secondary-l: 45%;
        --knd-theme-secondary: hsl(var(--knd-theme-secondary-h), var(--knd-theme-secondary-s), var(--knd-theme-secondary-l));
        --mdc-theme-secondary: var(--knd-theme-secondary);

        font-family: Barlow, sans-serif;
      }

      #buttons {
        background-color: var(--knd-theme-surface);
      }

      #widgetWrapper {
        width: 100%;
      }

      #widgetWrapper > * {
        max-width: ${size100x};
      }

      @media (min-width: 830px) {
        #widgetWrapper[size="large"] > * {
          margin-left: auto;
          margin-right: auto;
        }
      }
    `;
  }

  render() {
    return html`
      <div id="widgetWrapper" size=${this.size}>
        <test-widget size=${this.size}></test-widget>
        <test-widget size=${this.size}></test-widget>
        <test-widget size=${this.size}></test-widget>
      </div>
      <div id="buttons">
        <mwc-button label="tiny" @click=${() => this.size = 'tiny'}></mwc-button>
        <mwc-button label="small" @click=${() => this.size = 'small'}></mwc-button>
        <mwc-button label="medium" @click=${() => this.size = 'medium'}></mwc-button>
        <mwc-button label="large" @click=${() => this.size = 'large'}></mwc-button>
      </div>
    `;
  }
}