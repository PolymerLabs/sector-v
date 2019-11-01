import '@material/mwc-checkbox';
import '@material/mwc-formfield';
import '@material/mwc-icon';
import { Icon } from '@material/mwc-icon';
import '@material/mwc-ripple';
import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import { TabBar } from '@material/mwc-tab-bar';
import '@material/mwc-textfield';
import { TextField } from '@material/mwc-textfield';
import {
  css,
  customElement,
  html,
  property,
  PropertyValues,
  query,
  TemplateResult
} from 'lit-element';
import { fontSize3x } from '../util/base-styles';
import { ChecklistSchema } from '../util/db';
import { loadMaterialFonts } from '../util/font-loader';
import './knd-small';
import { KndWidgetBase } from './knd-widget-base';

@customElement('knd-widget-checklist')
export class KndWidgetChecklist extends KndWidgetBase {
  @query('#tabs') protected tabBar!: TabBar | null;
  @query('#addline mwc-textfield') protected textfield!: TextField | null;
  @property({ type: Boolean }) protected showDone = true;
  @property({ type: Array }) checked: string[] = [];
  @property({ type: Array }) unchecked: string[] = [];

  static get styles() {
    const style = css`
      :host {
        color: var(--knd-theme-primary);
      }

      #title {
        font-size: ${fontSize3x};
      }

      .divider {
        border-bottom-width: 1px;
        border-bottom-color: hsl(
          var(--knd-theme-on-surface-h),
          calc(var(--knd-theme-on-surface-s) - 10%),
          var(--knd-theme-on-surface-l)
        );
        border-bottom-style: solid;
      }

      mwc-formfield {
        flex-grow: 1;
      }

      mwc-tab-bar {
        --mdc-theme-primary: var(--knd-theme-secondary);
      }

      #addline {
        display: flex;
        align-items: center;
      }

      mwc-textfield {
        --mdc-text-field-fill-color: hsla(0dec, 0%, 100%, 96%);
      }

      .row {
        display: flex;
        align-items: center;
      }

      mwc-icon {
        cursor: pointer;
      }
    `;

    if (!('length' in super.styles)) {
      return [super.styles, style];
    }

    return [...super.styles, style];
  }

  firstUpdated() {
    const doc = this.offlineDoc as ChecklistSchema;
    this.checked = doc.checked ? doc.checked : [];
    this.unchecked = doc.unchecked ? doc.unchecked : [];
  }

  updated(changedProps: PropertyValues) {
    const checkedChanged = changedProps.has('checked');
    const uncheckedChanged = changedProps.has('unchecked');

    if (checkedChanged || uncheckedChanged) {
      const ce = new CustomEvent<{ doc: ChecklistSchema }>('update-doc', {
        detail: {
          doc: {
            checked: this.checked,
            unchecked: this.unchecked
          }
        },
        bubbles: true,
        composed: true
      });

      this.dispatchEvent(ce);
    }
  }

  renderTiny() {
    loadMaterialFonts();

    return html`
      <mwc-icon>create</mwc-icon>
    `;
  }

  renderSmall() {
    loadMaterialFonts();

    return html`
      <mwc-icon slot="icon">create</mwc-icon>
      <div slot="label">To-Done</div>
    `;
  }

  renderMedium() {
    const todo: TemplateResult[] = this.unchecked.map<TemplateResult>(
      (label, index) => {
        return html`
          <div class="row" index=${index}>
            <mwc-formfield .label=${label}>
              <mwc-checkbox></mwc-checkbox>
            </mwc-formfield>
            <span class="remove">
              <mwc-icon>clear</mwc-icon>
              <mwc-ripple unbounded primary></mwc-ripple>
            </span>
          </div>
          <div class="divider"></div>
        `;
      }
    );

    const done: TemplateResult[] = this.checked.map<TemplateResult>(
      (label, index) => {
        return html`
          <div class="row" index=${index}>
            <mwc-formfield .label=${label}>
              <mwc-checkbox checked></mwc-checkbox>
            </mwc-formfield>
            <span class="remove">
              <mwc-icon>clear</mwc-icon>
              <mwc-ripple unbounded primary></mwc-ripple>
            </span>
          </div>
          <div class="divider"></div>
        `;
      }
    );

    return html`
      <div id="title">
        To-Done
      </div>
      <mwc-tab-bar id="tabs" @MDCTabBar:activated=${this.tabBarActivated}>
        <mwc-tab label="To Do"></mwc-tab>
        <mwc-tab label="Done"></mwc-tab>
      </mwc-tab-bar>
      <div @click=${this.onClick}>
        ${this.showDone ? todo : done}
      </div>
      <div id="addline">
        <mwc-textfield label="New Task"></mwc-textfield>
        <span id="add" @click=${this.onAddClick}>
          <mwc-icon>add</mwc-icon>
          <mwc-ripple primary unbounded></mwc-ripple>
        </span>
      </div>
    `;
  }

  protected tabBarActivated() {
    const tabBar = this.tabBar;

    if (tabBar) {
      const index = tabBar.activeIndex;
      this.showDone = index === 0;
    }
  }

  renderLarge() {
    return this.renderMedium();
  }

  onClick(e: MouseEvent) {
    const target = e.target;

    if (!target) {
      return;
    }

    const isRemoveIconWrapper =
      target instanceof HTMLSpanElement && target.classList.contains('remove');

    if (target instanceof Icon || isRemoveIconWrapper) {
      const index = this.findIndexFromTarget(target as HTMLElement);

      if (this.showDone) {
        this.unchecked.splice(Number(index), 1);
        this.requestUpdate('unchecked', []);
      } else {
        this.checked.splice(Number(index), 1);
        this.requestUpdate('checked', []);
      }
    } else if (target instanceof HTMLElement) {
      const row = this.findRowFromTarget(target);
      if (row) {
        const cb = row
          .querySelector('mwc-checkbox')!
          .shadowRoot!.querySelector('input')!;
        const isChecked = cb.checked;
        const index = row.getAttribute('index');

        if (!!index) {
          if (isChecked && this.showDone) {
            const val = this.unchecked.splice(Number(index), 1)[0];
            if (val !== undefined) {
              this.checked.push(val);
            }

            // needed to prevent clicking the one under it
            e.preventDefault();
            this.requestUpdate('unchecked', []);
            this.requestUpdate('checked', []);
          } else if (!isChecked && !this.showDone) {
            const val = this.checked.splice(Number(index), 1)[0];
            if (val !== undefined) {
              this.unchecked.push(val);
            }

            // needed to prevent clicking the one under it
            e.preventDefault();
            this.requestUpdate('unchecked', []);
            this.requestUpdate('checked', []);
          }
        }
      }
    }
  }

  private findRowFromTarget(target: HTMLElement): HTMLElement | null {
    let row: HTMLElement | null = target;

    while (row && !row.classList.contains('row')) {
      row = row.parentElement;
    }

    return row;
  }

  private findIndexFromTarget(target: HTMLElement): number | null {
    const row = this.findRowFromTarget(target);

    if (row) {
      const index = row.getAttribute('index');

      if (!!index) {
        return Number(index);
      }
    }

    return null;
  }

  onAddClick() {
    const textfield = this.textfield;
    if (!textfield) {
      return;
    }

    if (this.showDone) {
      this.unchecked.push(textfield.value);
      this.requestUpdate('unchecked', []);
    } else {
      this.checked.push(textfield.value);
      this.requestUpdate('checked', []);
    }

    textfield.value = '';
  }
}
