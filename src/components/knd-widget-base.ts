import { LitElement, property, TemplateResult, html, css } from 'lit-element';
import { WidgetSize } from '../util/types';

import './knd-small';

import '@material/mwc-ripple';
import { size3x, size1x, radius1x, size2x, size10x, fontSize8x, fontSize2x, size5x } from '../util/base-styles';

export abstract class KndWidgetBase extends LitElement {
  @property({
    type: String,
    reflect: true,
    attribute: 'size'
  })
  size: WidgetSize = 'small';

  static get styles() {
    return css`
      :host([size="tiny"]),
      :host([size="small"]) {
        -webkit-tap-highlight-color: transparent;
        margin: ${size1x};
      }

      :host([size="tiny"]) #wrapper,
      :host([size="small"]) #wrapper {
        cursor: pointer;
      }

      :host([size="tiny"]) #wrapper,
      :host([size="small"]) #wrapper,
      :host([size="medium"]) #wrapper {
        border-radius: ${radius1x}
      }

      :host([size="small"]) #wrapper,
      :host([size="medium"]) #wrapper {
        padding: ${size2x};
      }

      :host([size="tiny"]) {
        display: inline-block;
      }

      :host([size="tiny"]) #wrapper {
        width: ${size10x};
        height: ${size10x};
        background-color: var(--knd-theme-surface);
        overflow: hidden;
        font-size: ${fontSize8x};
        --mdc-icon-size: ${fontSize8x};
      }

      :host([size="small"]) {
        display: block;
        margin-left: ${size3x};
        margin-right: ${size3x};
        margin-top: ${size1x};
      }

      :host([size="small"]) #wrapper {
        font-size: ${fontSize2x};
        --mdc-icon-size: ${size5x};

        background-color: var(--knd-theme-surface);
        height: ${size10x};
        box-sizing: border-box;
      }

      #wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;

        color: var(--knd-theme-primary);
      }
    `;
  }

  render() {
    switch (this.size) {
      case 'tiny':
        return html`
          <div id="wrapper">
            ${this.renderTiny()}
            <mwc-ripple primary></mwc-ripple>
          </div>`
      case 'small':
        return html`
          <div id="wrapper">
            <knd-small>${this.renderSmall()}</knd-small>
            <mwc-ripple primary></mwc-ripple>
          </div>
        `;
      case 'medium':
        return this.renderMedium();
      case 'large':
        return this.renderLarge();
      default:
        return neverReached(this.size);
    }
  }

  protected abstract renderTiny(): TemplateResult;
  protected abstract renderSmall(): TemplateResult;
  protected abstract renderMedium(): TemplateResult;
  protected abstract renderLarge(): TemplateResult;
};

const neverReached = (never: never) => never;