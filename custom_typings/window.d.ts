declare global {
  import P from 'pouchdb-browser';
  interface Window {
    doesNotSupportNomodule?: boolean;
    PouchDB: P;
  }
}

export {};