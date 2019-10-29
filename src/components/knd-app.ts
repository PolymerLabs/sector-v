import {LitElement, customElement, html, css} from 'lit-element';

@customElement('knd-app')
export class KndApp extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        width: 100vw;
        height: 100vh;
        background-color: lightgray;
      }
    `;
  }

  render() {
    return html`
      <div>hello world</div>
    `;
  }
}