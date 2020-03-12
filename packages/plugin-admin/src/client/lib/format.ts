import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import isValid from 'date-fns/isValid';
import parseISO from 'date-fns/parseISO';

export const isDate = (thing: any) => {
  if (thing instanceof Date) return true;
  return isValid(parseISO(thing));
};

export const formatIfDate = (thing: any) => {
  if (!isDate(thing)) return thing;
  return `${formatDistanceToNow(new Date(thing))} ago`;
};
