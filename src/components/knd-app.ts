import {LitElement, customElement, html, css, property} from 'lit-element';

import './test-widget';
import { WidgetSize } from '../util/types';
@customElement('knd-app')
export class KndApp extends LitElement {
  @property({type: String}) size: WidgetSize = 'small';

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;

        --knd-theme-primary-h: 140deg;
        --knd-theme-primary-s: 77%;
        --knd-theme-primary-l: 28%;
        --knd-theme-primary: hsl(var(--knd-theme-primary-h), var(--knd-theme-primary-s), var(--knd-theme-primary-l));
        --mdc-theme-primary: var(--knd-theme-primary);

        --knd-theme-surface: hsl(calc(var(--knd-theme-primary-h) - 4deg), calc(var(--knd-theme-primary-s) - 33%), calc(var(--knd-theme-primary-l) + 67%));

        font-family: Barlow, sans-serif;
      }

      #widgetWrapper {
        width: 100%;
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
    `;
  }
}