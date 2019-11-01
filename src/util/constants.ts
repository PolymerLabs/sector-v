import { html } from 'lit-element';
import { WidgetCatalog } from './types';

export const WIDGETS: WidgetCatalog = {
  'test-widget': {
    friendlyName: 'To-Do',
    renderer: (widgetId, size, active) => html`
      <test-widget size=${size} widgetId=${widgetId} ?active=${active}> </test-widget>
    `
  },
  'knd-widget-hue': {
    friendlyName: 'Huey',
    renderer: (widgetId, size, active) => html`
      <knd-widget-hue size=${size} widgetId=${widgetId} ?active=${active}> </knd-widget-hue>
    `
  },
  'knd-widget-calculator': {
    friendlyName: 'Calculon',
    renderer: (widgetId, size, active) => html`
      <knd-widget-calculator size=${size} widgetId=${widgetId} ?active=${active}>
      </knd-widget-calculator>
    `
  }
};
