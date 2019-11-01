import { html } from 'lit-element';
import { WidgetCatalog } from './types';

export const WIDGETS: WidgetCatalog = {
  'test-widget': {
    friendlyName: 'To-Do',
    renderer: (widgetId, size) => html`
      <test-widget size=${size} widgetId=${widgetId}> </test-widget>
    `
  },
  'knd-widget-hue': {
    friendlyName: 'Huey',
    renderer: (widgetId, size) => html`
      <knd-widget-hue size=${size} widgetId=${widgetId}> </knd-widget-hue>
    `
  },
  'knd-widget-calculator': {
    friendlyName: 'Calculon',
    renderer: (widgetId, size) => html`
      <knd-widget-calculator size=${size} widgetId=${widgetId}>
      </knd-widget-calculator>
    `
  }
};
