import formatDistanceToNow from 'date-fns/formatDistanceToNow';

export const formatIfDate = (str: string) => {
  return `${formatDistanceToNow(new Date(str))} ago`;
};
