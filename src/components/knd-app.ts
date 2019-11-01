import './test-widget';
import './knd-widget-hue';
import './knd-calculator';
import '@material/mwc-button';
import {
  LitElement,
  customElement,
  html,
  css,
  property,
  query,
  TemplateResult
} from 'lit-element';
import { until } from 'lit-html/directives/until';

import './test-widget';
import './knd-widget-hue';
import './knd-calculator';

import { WidgetSize, WidgetDescriptor } from '../util/types';
import {
  PouchDB,
  DB_NAME,
  WidgetsSchema,
  docNames,
  schemaToDescriptor
} from '../util/db';

import '@material/mwc-button';
import '@material/mwc-fab';
import '@material/mwc-dialog';
import '@material/mwc-radio';
import '@material/mwc-formfield';
import '@material/mwc-icon';

import { Dialog } from '@material/mwc-dialog';
import { Radio } from '@material/mwc-radio';
import { fontSize1x, size1x } from '../util/base-styles';
import { generatePseudoUid, isIdInWidgetNames } from '../util/uid';
import { loadMaterialFonts } from '../util/font-loader';
import { WIDGETS } from '../util/constants';

const sizes: ReadonlySet<WidgetSize> = new Set<WidgetSize>([
  'tiny',
  'small',
  'medium',
  'large'
]);
function isSize(s: string): s is WidgetSize {
  return sizes.has(s as WidgetSize);
}
const defaultSize = 'medium';

@customElement('knd-app')
export class KndApp extends LitElement {
  @query('#addWidgetDialog') addWidgetDialog!: Dialog | null;
  @query('mwc-radio[name="addWidget"][checked]')
  checkedAddWidgetRadio!: Radio | null;
  @property({ type: String }) protected size: WidgetSize = defaultSize;
  @property({ type: Boolean }) protected openAddWidgetDialog = false;

  private _activeWidgetId: string | null = null;
  protected set activeWidgetId(value: string | null) {
    const oldValue = this._activeWidgetId;
    const db = this.db;
    db.upsert<WidgetsSchema>(docNames.WIDGETS, docPart => {
      const doc = docPart as WidgetsSchema;
      doc.active = value;
      return doc;
    });
    this._activeWidgetId = value;
    this.requestUpdate('activeWidgetId', oldValue);
  }

  @property({ type: String })
  protected get activeWidgetId(): string | null {
    return this._activeWidgetId;
  }

  protected db = new PouchDB(DB_NAME);

  @property({ type: Object })
  protected widgets: Promise<WidgetDescriptor[]> = (async () => {
    const db = this.db;

    if (!db) {
      return [];
    }

    let widgetDoc: WidgetsSchema | null = null;

    await db.upsert<WidgetsSchema>(docNames.WIDGETS, doc => {
      if (doc.names && doc.active !== undefined) {
        widgetDoc = doc as WidgetsSchema;
        this.activeWidgetId = doc.active === 'null' ? null : doc.active;
        return false;
      } else {
        widgetDoc = { names: [], active: null };
        return widgetDoc;
      }
    });

    return widgetDoc ? schemaToDescriptor(widgetDoc) : [];
  })();

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        --mdc-icon-font: Material Icons Outlined;
        --knd-theme-primary: hsl(
          var(--knd-theme-primary-h),
          var(--knd-theme-primary-s),
          var(--knd-theme-primary-l)
        );
        --mdc-theme-primary: var(--knd-theme-primary);

        --knd-theme-surface: hsl(
          calc(var(--knd-theme-primary-h) - 4deg),
          calc(var(--knd-theme-primary-s) - 33%),
          calc(var(--knd-theme-primary-l) + 67%)
        );
        --mdc-theme-surface: var(--knd-theme-surface);

        --knd-theme-on-surface-h: calc(var(--knd-theme-primary-h) - 2deg);
        --knd-theme-on-surface-s: calc(var(--knd-theme-primary-s) - 59%);
        --knd-theme-on-surface-l: calc(var(--knd-theme-primary-l) + 42%);
        --knd-theme-on-surface: hsl(
          var(--knd-theme-primary-h),
          var(--knd-theme-primary-s),
          var(--knd-theme-primary-l)
        );
        --mdc-theme-on-surface: var(--knd-theme-on-surface);

        --knd-theme-secondary-h: 31deg;
        --knd-theme-secondary-s: 100%;
        --knd-theme-secondary-l: 45%;
        --knd-theme-secondary: hsl(
          var(--knd-theme-secondary-h),
          var(--knd-theme-secondary-s),
          var(--knd-theme-secondary-l)
        );
        --mdc-theme-secondary: var(--knd-theme-secondary);

        font-family: Barlow, sans-serif;
        font-size: ${fontSize1x};
      }

      #buttons {
        background-color: var(--knd-theme-surface);
      }

      #widgetWrapper {
        display: grid;
        grid-gap: 20px 20px;
        position: relative;
        margin: 0 auto;
        max-width: 830px;
      }

      #widgetWrapper[size='medium'] {
        grid-template-columns: repeat(2, calc(50% - 20px));
      }
      #widgetWrapper[size='large'] {
        grid-template-columns: 100%;
      }

      #widgetWrapper[size='medium'] > * {
        z-index: 1;
      }
      #widgetWrapper[size='medium'] > knd-widget-hue:hover,
      #widgetWrapper[size='medium'] > knd-widget-calculator:hover,
      #widgetWrapper[size='medium'] > test-widget:hover {
        z-index: 2;
      }

      #widgetWrapper[size='large'] > *[active] {
        display: block;
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 60px;
      }
      #widgetWrapper[size='large'] > * {
        display: none;
      }

      knd-widget-calculator {
        --knd-theme-surface: #8d6e63;
        --mdc-theme-surface: #8d6e63;
        --knd-theme-primary: #ffffff;
        --mdc-theme-primary: #ffffff;
        color: #ffffff;
      }

      mwc-fab {
        position: fixed;
        bottom: ${size1x};
        right: ${size1x};
        z-index: 10;
      }

      #addWidgetDialog mwc-formfield {
        display: block;
      }

      #exitWidget {
        display: none;
        position: fixed;
        --mdc-icon-size: 64px;
        color: white;
        cursor: pointer;
      }
      #exitWidget[size='large'] {
        display: block;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
      }
    `;
  }

  renderSizeButtons() {
    return html`
      <div id="buttons">
        <mwc-button
          label="tiny"
          @click=${() => this.updateSize('tiny')}
        ></mwc-button>
        <mwc-button
          label="small"
          @click=${() => this.updateSize('small')}
        ></mwc-button>
        <mwc-button
          label="medium"
          @click=${() => this.updateSize('medium')}
        ></mwc-button>
        <mwc-button
          label="large"
          @click=${() => this.updateSize('large')}
        ></mwc-button>
      </div>
    `;
  }

  private updateSize(size: WidgetSize) {
    this.size = size;
    if (size !== 'large') {
      this.activeWidgetId = null;
    }

    if (size === defaultSize) {
      // We want no hash at all. This is the only way lol.
      history.pushState(
        null,
        document.title,
        window.location.pathname + window.location.search
      );
    } else {
      window.location.hash = size;
    }
  }

  render() {
    loadMaterialFonts();
    const widgetsRendered = this.widgets.then(widgetDescriptors => {
      const resultArray = widgetDescriptors.map<TemplateResult>(descriptor => {
        const active = descriptor.id === this.activeWidgetId;
        return descriptor.renderer(descriptor.id, this.size, active);
      });
      return html`
        ${resultArray}
      `;
    });
    return html`
      <!-- For debuggin' -->
      <!-- ${this.renderSizeButtons()} -->

      <div
        id="widgetWrapper"
        size=${this.size}
        @close-widget=${this.onCloseWidget}
        @expand-widget=${this.onExpandWidget}
      >
        ${until(widgetsRendered)}
      </div>
      <mwc-icon id="exitWidget" size=${this.size} @click=${this.onExitWidget}>
        keyboard_arrow_up
      </mwc-icon>
      <mwc-fab icon="add" @click=${this.onAddWidgetClick}></mwc-fab>
      <mwc-dialog
        id="addWidgetDialog"
        ?open=${this.openAddWidgetDialog}
        @closed=${this.onAddDialogClose}
        title="Add a widget!"
      >
        ${Object.keys(WIDGETS).map<TemplateResult>((widgetName, i) => {
          const widgetData = WIDGETS[widgetName];
          return html`
            <mwc-formfield label="${widgetData.friendlyName}">
              <mwc-radio
                name="addWidget"
                .checked=${i === 0}
                .value="${widgetName}"
              >
              </mwc-radio>
            </mwc-formfield>
          `;
        })}
        <mwc-button slot="primaryAction" dialogAction="add">
          add
        </mwc-button>
        <mwc-button slot="secondaryAction" dialogAction="cancel">
          cancel
        </mwc-button>
      </mwc-dialog>
    `;
  }

  firstUpdated() {
    this.onWindowResize();
  }

  onExitWidget() {
    this.updateSize('medium');
    this.onWindowResize();
  }

  private readonly onHashChange = () => {
    const hash = window.location.hash.slice(1);
    if (isSize(hash)) {
      this.size = hash;
    } else if (hash === '') {
      this.size = defaultSize;
    }
  };

  private readonly onWindowResize = () => {
    if (this.size === 'large') {
      return;
    }

    const size = window.innerWidth < 600 ? 'small' : 'medium';

    if (size !== this.size) {
      this.size = size;
    }
  };

  async connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this.onHashChange);
    window.addEventListener('popstate', this.onHashChange);
    window.addEventListener('resize', this.onWindowResize, { passive: true });
    this.onHashChange();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this.onHashChange);
    window.removeEventListener('popstate', this.onHashChange);
    window.removeEventListener('resize', this.onWindowResize);
  }

  async onExpandWidget(e: Event) {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    const id = e.target.getAttribute('widgetId');

    this.activeWidgetId = id;
    this.updateSize('large');
  }

  async onCloseWidget(e: Event) {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    const id = e.target.getAttribute('widgetId');

    await this.db.upsert<WidgetsSchema>(docNames.WIDGETS, docPart => {
      const doc = docPart as WidgetsSchema;

      doc.names = doc.names.filter(name => {
        return name.id !== id;
      });

      this.widgets = schemaToDescriptor(doc);

      return doc;
    });
  }

  async onAddWidgetClick() {
    const dialog = this.addWidgetDialog;

    if (!dialog) {
      return;
    }

    this.openAddWidgetDialog = true;
  }

  protected onAddDialogClose(e: CustomEvent<{ action: string }>) {
    this.openAddWidgetDialog = false;
    const action = e.detail.action;
    if (action !== 'add') {
      return;
    }

    const radio = this.checkedAddWidgetRadio;

    if (!radio) {
      return;
    }

    const tagName = radio.value;

    this.addWidget(tagName);
  }

  protected addWidget(tagName: string) {
    this.db.upsert<WidgetsSchema>(docNames.WIDGETS, docPart => {
      const doc = docPart as WidgetsSchema;
      let uid = generatePseudoUid();

      while (isIdInWidgetNames(doc.names, uid)) {
        uid = generatePseudoUid();
      }

      doc.names.push({ name: tagName, id: uid });
      this.widgets = schemaToDescriptor(doc);

      return doc;
    });
  }
}
