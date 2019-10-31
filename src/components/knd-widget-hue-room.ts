import { customElement, LitElement, html, property, css, query } from "lit-element";
import {Slider} from '@material/mwc-slider';

import '@material/mwc-checkbox';
import { size1x, size2x, fontSize2x } from "../util/base-styles";


@customElement('knd-widget-hue-room')
export class KndWidgetHueFixture extends LitElement {
  @property({type: String}) name = '';

  @query('#fixtures') fixtures!: HTMLDivElement | null;

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

        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      #fixtures::-webkit-scrollbar,
      #fixtures::-webkit-scrollbar {
        display: none;
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

  onWheel(e: WheelEvent) {
    const fixturesWrapper = this.fixtures;

    if (!fixturesWrapper) {
      return;
    }

    const dy = e.deltaY;
    const oldScrollLeft = fixturesWrapper.scrollLeft;
    fixturesWrapper.scrollLeft += dy;

    if (oldScrollLeft !== fixturesWrapper.scrollLeft) {
      e.preventDefault();
    }
  }

  onTouchmove(e: Event) {
    const path = e.composedPath();

    for (let el of path) {
      if (el instanceof Slider) {
        e.preventDefault();
        break;
      }
    }
  }

  render() {
    return html`
      <div id="name">${this.name}</div>
      <div id="fixtures" @wheel=${this.onWheel} @touchmove=${this.onTouchmove}>
        <slot></slot>
      </div>
    `;
  }
}