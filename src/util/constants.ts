import { html } from "lit-element";
import { WidgetRenderers } from "./types";



export const WIDGET_RENDERERS: WidgetRenderers = {
  'test-widget': (widgetId, size) => html`
      <test-widget
          size=${size}
          widgetId=${widgetId}>
      </test-widget>`,
  'knd-widget-hue': (widgetId, size) => html`
      <knd-widget-hue
          size=${size}
          widgetId=${widgetId}>
      </knd-widget-hue>`,
  'knd-widget-calculator': (widgetId, size) => html`
      <knd-widget-calculator
          size=${size}
          widgetId=${widgetId}>
      </knd-widget-calculator>`,
}