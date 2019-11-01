import '@material/mwc-button';
import '@material/mwc-dialog';
import { Dialog } from '@material/mwc-dialog';
import '@material/mwc-fab';
import '@material/mwc-formfield';
import '@material/mwc-icon';
import '@material/mwc-radio';
import { Radio } from '@material/mwc-radio';
import {
  css,
  customElement,
  html,
  LitElement,
  property,
  query,
  TemplateResult
} from 'lit-element';
import { until } from 'lit-html/directives/until';
import { fontSize1x, size1x } from '../util/base-styles';
import { WIDGETS } from '../util/constants';
import {
  DB_NAME,
  docNames,
  PouchDB,
  schemaToDescriptor,
  WidgetsSchema
} from '../util/db';
import { loadMaterialFonts } from '../util/font-loader';
import { WidgetDescriptor, WidgetSize } from '../util/types';
import { generatePseudoUid, isIdInWidgetNames } from '../util/uid';
import './knd-calculator';
import './knd-widget-hue';
import './knd-widget-checklist';
import { KndWidgetBase } from './knd-widget-base';

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
  @property({ type: String, attribute: 'size', reflect: true })
  protected size: WidgetSize = defaultSize;
  @property({ type: String, attribute: 'screen-size', reflect: true })
  protected screenSize: 'mobile' | 'desktop' = 'desktop';
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

    return widgetDoc ? schemaToDescriptor(widgetDoc, this.db) : [];
  })();

  static get styles() {
    return css`
      :host([size='large']) {
        height: 100vh;
      }
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

      :host([size='medium']) #widgetWrapper {
        grid-template-columns: repeat(2, calc(50% - 20px));
      }
      :host([size='large']) #widgetWrapper {
        grid-template-columns: 100%;
      }

      :host([size='medium']) #widgetWrapper > * {
        z-index: 1;
      }
      :host([size='medium']) #widgetWrapper > knd-widget-hue:hover,
      :host([size='medium']) #widgetWrapper > knd-widget-calculator:hover,
      :host([size='medium']) #widgetWrapper > knd-widget-checklist:hover {
        z-index: 2;
      }

      :host([size='large']) #widgetWrapper > *[active] {
        display: block;
      }
      :host([size='large']) #widgetWrapper > * {
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

      #exitWidget,
      .spacer {
        display: none;
        --mdc-icon-size: 64px;
        color: white;
        cursor: pointer;
      }

      :host([size='large']) #widgetWrapper,
      :host([size='large']) #exitWidget {
        align-items: center;
        display: block;
      }

      :host([size='large']) #widgetWrapper {
        width: 100%;
      }

      #exitWidget {
        margin: 0 auto 0 auto;
        height: 10vh;
      }

      :host([size='large']) #root {
        display: flex;
        align-items: center;
        flex-direction: column;
        height: 100%;
      }

      :host([size='large']):host([screen-size='mobile']) .top.spacer,
      :host([size='large']):host([screen-size='desktop']) .bottom.spacer {
        display: block;
        flex-grow: 1;
      }
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
        const offlineDoc = descriptor.offlineDoc;

        return descriptor.renderer(
          descriptor.id,
          this.size,
          active,
          offlineDoc
        );
      });
      return html`
        ${resultArray}
      `;
    });
    return html`
      <div id="root" size=${this.size}>
        <div class="top spacer"></div>
        <div
          id="widgetWrapper"
          @close-widget=${this.onCloseWidget}
          @expand-widget=${this.onExpandWidget}
          @update-doc=${this.onUpdateDoc}
          @delete-doc=${this.onDeleteDoc}
        >
          ${until(widgetsRendered)}
        </div>
        <div class="bottom spacer"></div>
        <mwc-icon id="exitWidget" @click=${this.onExitWidget}>
          keyboard_arrow_up
        </mwc-icon>
        <mwc-fab icon="add" @click=${this.onAddWidgetClick}></mwc-fab>
      </div>

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

    this.onWindowResize();
  };

  private readonly onWindowResize = () => {
    const size = window.innerWidth < 600 ? 'small' : 'medium';
    this.screenSize = size === 'small' ? 'mobile' : 'desktop';

    if (this.size === 'large') {
      return;
    }

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

      this.widgets = schemaToDescriptor(doc, this.db);

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
      this.widgets = schemaToDescriptor(doc, this.db);

      return doc;
    });
  }

  protected async onUpdateDoc(e: CustomEvent) {
    const target = e.target as null | KndWidgetBase;
    if (!target) {
      return;
    }

    const id = target.getAttribute('widgetId');

    if (!id) {
      return;
    }

    this.db.upsert(id, _ => e.detail.doc);
  }

  protected async onDeleteDoc(e: CustomEvent) {
    const target = e.target as null | KndWidgetBase;
    if (!target) {
      return;
    }

    const id = target.getAttribute('widgetId');

    if (!id) {
      return;
    }

    try {
      const doc = await this.db.get(id);
      await this.db.remove(doc);
    } catch (err) {}
  }
}
