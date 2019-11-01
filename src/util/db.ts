import PouchDBType from 'pouchdb-browser';
import { WidgetDescriptor, WidgetRenderer } from './types';
import { WIDGETS } from './constants';
export const PouchDB: typeof PouchDBType = window.PouchDB;
export const DB_NAME = 'knd-app';

export type UpsertDiffCallback<T extends {}> = (
  doc: PouchDB.Core.Document<T>
) => T & Partial<PouchDB.Core.IdMeta> | PouchDB.CancelUpsert;

export interface WidgetName {
  name: string;
  id: string;
}
export interface WidgetsSchema {
  names: WidgetName[];
  active: string | null;
}

export interface DBSchema {
  widgets: WidgetsSchema;
}

export const docNames = {
  WIDGETS: 'widgets'
};

const getRenderer = (name: string): null | WidgetRenderer => {
  const widget = WIDGETS[name];
  if (!widget) {
    return null;
  }

  return widget.renderer;
};

export const schemaToDescriptor = async (
  doc: WidgetsSchema
): Promise<WidgetDescriptor[]> => {
  const widgets: WidgetDescriptor[] = [];
  for (let widgetName of doc.names) {
    const renderer = getRenderer(widgetName.name);

    if (!renderer) {
      continue;
    }

    const descriptor: WidgetDescriptor = {
      id: widgetName.id,
      renderer
    };

    widgets.push(descriptor);
  }

  return widgets;
};
