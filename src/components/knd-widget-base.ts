import { LitElement, property, TemplateResult, html, css, CSSResult } from 'lit-element';
import { WidgetSize } from '../util/types';

import './knd-small';

import '@material/mwc-ripple';
import '@material/mwc-fab';
import { size3x, size1x, radius1x, size2x, size10x, fontSize3x, fontSize2x, size5x, size45x, radius3x } from '../util/base-styles';

/**
 * @fires close-widget
 * @fires update-doc
 */
export abstract class KndWidgetBase extends LitElement {
  @property({
    type: String,
    reflect: true,
    attribute: 'size'
  })
  size: WidgetSize = 'small';

  static get styles(): CSSResult|CSSResult[] {
    return css`
      :host {
        position: relative;
      }

      :host([size="tiny"]),
      :host([size="medium"]),
      :host([size="large"]) {
        margin: ${size1x};
      }

      :host([size="tiny"]) {
        -webkit-tap-highlight-color: transparent;
      }

      :host([size="tiny"]) #knd-widget-base-wrapper,
      :host([size="small"]) #knd-widget-base-wrapper {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;

        color: var(--knd-theme-primary);
      }

      :host([size="tiny"]) #knd-widget-base-wrapper,
      :host([size="small"]) #knd-widget-base-wrapper,
      :host([size="medium"]) #knd-widget-base-wrapper,
      :host([size="large"]) #knd-widget-base-wrapper {
        border-radius: ${radius1x};
        background-color: var(--knd-theme-surface);
      }

      :host([size="small"]) #knd-widget-base-wrapper,
      :host([size="medium"]) #knd-widget-base-wrapper,
      :host([size="large"]) #knd-widget-base-wrapper {
        padding: ${size2x};
      }

      :host([size="tiny"]) {
        display: inline-block;
      }

      :host([size="tiny"]) #knd-widget-base-wrapper {
        width: ${size10x};
        height: ${size10x};
        overflow: hidden;
        font-size: ${fontSize3x};
        --mdc-icon-size: ${fontSize3x};
      }

      :host([size="small"]) {
        display: block;
        margin-left: ${size3x};
        margin-right: ${size3x};
        margin-top: ${size1x};
      }

      :host([size="small"]) #knd-widget-base-wrapper {
        font-size: ${fontSize2x};
        --mdc-icon-size: ${size5x};

        height: ${size10x};
        box-sizing: border-box;
        width: 100%;
      }

      :host([size="medium"]) #knd-widget-base-wrapper {
        max-height: ${size45x};
      }

      :host([size="medium"]) #knd-widget-base-wrapper,
      :host([size="large"]) #knd-widget-base-wrapper {
        -ms-overflow-style: none;
        scrollbar-width: none;
        overflow-y: scroll;
        overflow-x: hidden;
      }

      :host([size="medium"]) #knd-widget-base-wrapper::-webkit-scrollbar,
      :host([size="large"]) #knd-widget-base-wrapper::-webkit-scrollbar {
        display: none;
      }

      :host([size="large"]) #knd-widget-base-wrapper {
        display: block;
        border-radius: ${radius3x};
        height: 85%;
      }

      :host([size="large"]),
      :host([size="medium"]) {
        display: block;
      }

      #knd-widget-base-wrapper {
        position: relative;
        z-index: 2;
      }

      #knd-widget-expand, #knd-widget-remove {
        position: absolute;
        top: 0px;
        right: 0px;
        transition: transform ease-out 0.2s;
        padding: ${size1x};
        z-index: 1;
      }
      #knd-widget-expand {
        transform: translate(0%, 100%);
        --mdc-theme-secondary: #0091EA;
        --mdc-theme-on-secondary: white;
      }
      #knd-widget-remove {
        transform: translate(0%, 0%);
        --mdc-theme-secondary: #D50000;
        --mdc-theme-on-secondary: white;
      }
      :host(:hover) #knd-widget-expand {
        transform: translate(100%, 100%);
      }
      :host(:hover) #knd-widget-remove {
        transform: translate(100%, 0%);
        transition-delay: 0.05s;
      }
      :host(:not([size="medium"])) #knd-widget-expand,
      :host(:not([size="medium"]):not([size="small"])) #knd-widget-remove {
        display: none;
      }
    `;
  }

  render() {
    let contents = html``;
    switch (this.size) {
      case 'tiny':
        contents = html`
          ${this.renderTiny()}
          <mwc-ripple primary></mwc-ripple>`;
        break;
      case 'small':
        contents = html`
          <knd-small>${this.renderSmall()}</knd-small>
          <mwc-ripple primary></mwc-ripple>`;
        break;
      case 'medium':
        contents = this.renderMedium();
        break;
      case 'large':
        contents = this.renderLarge();
        break;
      default:
        return neverReached(this.size);
    }

    return html`
      <div id="knd-widget-base-wrapper">${contents}</div>
      <div id="knd-widget-expand"><mwc-fab mini icon="fullscreen"></mwc-fab></div>
      <div id="knd-widget-remove">
        <mwc-fab mini icon="clear" @click=${this.fireClose}></mwc-fab>
      </div>`;
  }

  fireClose(e: Event) {
    const closeEvent = new Event('close-widget', {bubbles: true, composed: true});
    if (e.target) {
      e.target.dispatchEvent(closeEvent);
    }
  }

  protected abstract renderTiny(): TemplateResult;
  protected abstract renderSmall(): TemplateResult;
  protected abstract renderMedium(): TemplateResult;
  protected abstract renderLarge(): TemplateResult;
};

const neverReached = (never: never) => never;