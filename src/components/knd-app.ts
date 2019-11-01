import './test-widget';
import './knd-widget-hue';
import './knd-calculator';
import '@material/mwc-button';

import {css, customElement, html, LitElement, property} from 'lit-element';

import {fontSize1x, size100x} from '../util/base-styles';
import {WidgetSize} from '../util/types';

const sizes: ReadonlySet<WidgetSize> =
    new Set<WidgetSize>(['tiny', 'small', 'medium', 'large']);
function isSize(s: string): s is WidgetSize {
  return sizes.has(s as WidgetSize);
}
const defaultSize = 'medium';

@customElement('knd-app')
export class KndApp extends LitElement {
  @property({type: String}) protected size: WidgetSize = defaultSize;

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        --mdc-icon-font: Material Icons Outlined;
        --knd-theme-primary: hsl(var(--knd-theme-primary-h), var(--knd-theme-primary-s), var(--knd-theme-primary-l));
        --mdc-theme-primary: var(--knd-theme-primary);

        --knd-theme-surface: hsl(calc(var(--knd-theme-primary-h) - 4deg), calc(var(--knd-theme-primary-s) - 33%), calc(var(--knd-theme-primary-l) + 67%));
        --mdc-theme-surface: var(--knd-theme-surface);

        --knd-theme-on-surface-h: calc(var(--knd-theme-primary-h) - 2deg);
        --knd-theme-on-surface-s: calc(var(--knd-theme-primary-s) - 59%);
        --knd-theme-on-surface-l: calc(var(--knd-theme-primary-l) + 42%);
        --knd-theme-on-surface: hsl(var(--knd-theme-primary-h), var(--knd-theme-primary-s), var(--knd-theme-primary-l));
        --mdc-theme-on-surface: var(--knd-theme-on-surface);

        --knd-theme-secondary-h: 31deg;
        --knd-theme-secondary-s: 100%;
        --knd-theme-secondary-l: 45%;
        --knd-theme-secondary: hsl(var(--knd-theme-secondary-h), var(--knd-theme-secondary-s), var(--knd-theme-secondary-l));
        --mdc-theme-secondary: var(--knd-theme-secondary);

        font-family: Barlow, sans-serif;
        font-size: ${fontSize1x};
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

      knd-widget-calculator {
        --knd-theme-surface: #8d6e63;
        --mdc-theme-primary: #ffffff;
        color: #ffffff;
      }
    `;
  }

  private updateSize(size: WidgetSize) {
    this.size = size;
    if (size === defaultSize) {
      // We want no hash at all. This is the only way lol.
      history.pushState(
          null, document.title,
          window.location.pathname + window.location.search);
    } else {
      window.location.hash = size;
    }
  }

  render() {
    return html`
      <div id="buttons">
        <mwc-button label="tiny" @click=${
        () => this.updateSize('tiny')}></mwc-button>
        <mwc-button label="small" @click=${
        () => this.updateSize('small')}></mwc-button>
        <mwc-button label="medium" @click=${
        () => this.updateSize('medium')}></mwc-button>
        <mwc-button label="large" @click=${
        () => this.updateSize('large')}></mwc-button>
      </div>

      <div id="widgetWrapper" size=${this.size}>
        <knd-widget-calculator size=${this.size}></knd-widget-calculator>
        <knd-widget-hue size=${this.size}></knd-widget-hue>
        <test-widget size=${this.size}></test-widget>
        <test-widget size=${this.size}></test-widget>
      </div>

    `;
  }

  private readonly onHashChange = () => {
    console.log('hash changed');
    const hash = window.location.hash.slice(1);
    if (isSize(hash)) {
      this.size = hash;
    } else if (hash === '') {
      this.size = defaultSize;
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this.onHashChange);
    window.addEventListener('popstate', this.onHashChange);
    this.onHashChange();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this.onHashChange);
    window.removeEventListener('popstate', this.onHashChange);
  }
}
