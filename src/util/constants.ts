import { html } from 'lit-element';
import { WidgetCatalog } from './types';

export const WIDGETS: WidgetCatalog = {
  'knd-widget-checklist': {
    friendlyName: 'To-Do',
    renderer: (widgetId, size, active, offlineDoc) => html`
      <knd-widget-checklist
        size=${size}
        widgetId=${widgetId}
        ?active=${active}
        .offlineDoc=${offlineDoc}
      >
      </knd-widget-checklist>
    `
  },
  'knd-widget-hue': {
    friendlyName: 'Huey',
    renderer: (widgetId, size, active, offlineDoc) => html`
      <knd-widget-hue
        size=${size}
        widgetId=${widgetId}
        ?active=${active}
        .offlineDoc=${offlineDoc}
      >
      </knd-widget-hue>
    `
  },
  'knd-widget-calculator': {
    friendlyName: 'Calculon',
    renderer: (widgetId, size, active, offlineDoc) => html`
      <knd-widget-calculator
        size=${size}
        widgetId=${widgetId}
        ?active=${active}
        .offlineDoc=${offlineDoc}
      >
      </knd-widget-calculator>
    `
  }
};
