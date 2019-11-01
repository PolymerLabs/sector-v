import { TemplateResult } from "lit-element";

export type WidgetSize = 'tiny' | 'small' | 'medium' | 'large';

export type WidgetSettings = {[setting:string]: string};

export interface WidgetDescriptor {
  id: string;
  renderer: WidgetRenderer;
}

export type WidgetRenderer = (widgetId: string, size: WidgetSize) => TemplateResult
export interface WidgetRenderers {
  [name: string]: WidgetRenderer;
};