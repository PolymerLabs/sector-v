import { WidgetName } from './db';

export const generatePseudoUid = () => {
  return (
    '' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

export const isIdInWidgetNames = (names: WidgetName[], id: string): boolean => {
  for (let i = 0; i < names.length; i++) {
    if (names[i].id === id) {
      return true;
    }
  }

  return false;
};
