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

import { Dialog } from '@material/mwc-dialog';
import { Radio } from '@material/mwc-radio';
import { size100x, fontSize1x, size1x } from '../util/base-styles';
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

  protected db = new PouchDB(DB_NAME);

  @property({ type: Object }) protected widgets: Promise<
    WidgetDescriptor[]
  > = (async () => {
    const db = this.db;

    if (!db) {
      return [];
    }

    let widgetDoc: WidgetsSchema | null = null;

    await db.upsert<WidgetsSchema>(docNames.WIDGETS, doc => {
      if (doc.names) {
        widgetDoc = doc as WidgetsSchema;
        return false;
      } else {
        widgetDoc = { names: [] };
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
        width: 100%;
      }

      #widgetWrapper > * {
        max-width: ${size100x};
      }

      @media (min-width: 830px) {
        #widgetWrapper[size='small'] > *,
        #widgetWrapper[size='large'] > *,
        #widgetWrapper[size='medium'] > * {
          margin-left: auto;
          margin-right: auto;
        }
      }

      knd-widget-calculator {
        --knd-theme-surface: #8d6e63;
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
    `;
  }

  private updateSize(size: WidgetSize) {
    this.size = size;
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
      const resultArray = widgetDescriptors.map<TemplateResult>(descriptor =>
        descriptor.renderer(descriptor.id, this.size)
      );
      return html`
        ${resultArray}
      `;
    });
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

      <div
        id="widgetWrapper"
        size=${this.size}
        @close-widget=${this.onCloseWidget}
      >
        ${until(widgetsRendered)}
      </div>
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
