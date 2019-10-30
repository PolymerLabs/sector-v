import { KndWidgetBase } from "./knd-widget-base";
import { customElement, html, css, query, property } from "lit-element";

import './knd-small';

import '@material/mwc-icon';
import '@material/mwc-checkbox';
import '@material/mwc-formfield';
import '@material/mwc-tab-bar';
import {TabBar} from '@material/mwc-tab-bar';
import '@material/mwc-tab';

import { loadMaterialFonts } from "../util/font-loader";

@customElement('test-widget')
export class TestWidget extends KndWidgetBase {

  @query('#tabs') protected tabBar!: TabBar|null;
  @property({type: Boolean}) protected showTodo = true;

  static get styles() {
    const style = css`
      #title {
        color: var(--knd-theme-primary);
      }

      .divider {
        border-bottom-width: 1px;
        border-bottom-color: var(--knd-theme-on-surface);
        border-bottom-style: solid;
      }

      mwc-formfield {
        display: block;
      }

      mwc-tab-bar {
        --mdc-theme-primary: var(--knd-theme-secondary);
      }
    `;

    if (!('length' in super.styles)) {
      return [super.styles, style];
    }

    return [...super.styles, style];
  }

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
    const todo = html`
        <mwc-formfield label="thinger">
          <mwc-checkbox></mwc-checkbox>
        </mwc-formfield>
        <div class="divider"></div>
        <mwc-formfield label="thinger">
          <mwc-checkbox></mwc-checkbox>
        </mwc-formfield>
        <div class="divider"></div>
        <mwc-formfield label="thinger">
          <mwc-checkbox></mwc-checkbox>
        </mwc-formfield>
        <div class="divider"></div>
        <mwc-formfield label="thinger">
          <mwc-checkbox></mwc-checkbox>
        </mwc-formfield>
        <div class="divider"></div>
        <mwc-formfield label="thinger">
          <mwc-checkbox></mwc-checkbox>
        </mwc-formfield>
        <div class="divider"></div>
        <mwc-formfield label="thinger">
          <mwc-checkbox></mwc-checkbox>
        </mwc-formfield>`;

    const done = html`
        <mwc-formfield label="checked">
          <mwc-checkbox checked></mwc-checkbox>
        </mwc-formfield>
        <div class="divider"></div>
        <mwc-formfield label="checked">
          <mwc-checkbox checked></mwc-checkbox>
        </mwc-formfield>
        <div class="divider"></div>
        <mwc-formfield label="checked">
          <mwc-checkbox checked></mwc-checkbox>
        </mwc-formfield>
        <div class="divider"></div>
        <mwc-formfield label="checked">
          <mwc-checkbox checked></mwc-checkbox>
        </mwc-formfield>
        <div class="divider"></div>
        <mwc-formfield label="checked">
          <mwc-checkbox checked></mwc-checkbox>
        </mwc-formfield>
        <div class="divider"></div>
        <mwc-formfield label="checked">
          <mwc-checkbox checked></mwc-checkbox>
        </mwc-formfield>`;

    return html`
      <h1 id="title">
        Test Widget
      </h1>
      <mwc-tab-bar id="tabs" @MDCTabBar:activated=${this.tabBarActivated}>
        <mwc-tab label="To Do"></mwc-tab>
        <mwc-tab label="Done"></mwc-tab>
      </mwc-tab-bar>
      <div>
        ${this.showTodo ? todo : done}
      </div>`;
  }

  protected tabBarActivated() {
    const tabBar = this.tabBar;

    if (tabBar) {
      const index = tabBar.activeIndex;
      this.showTodo = index === 0;
    }
  }

  renderLarge() {
    return this.renderMedium();
  }
};