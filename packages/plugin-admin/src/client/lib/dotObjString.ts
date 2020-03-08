import dot from 'dot-object';

export const dotObjString = (str: string, data: object, prefix: string = '') => {
  let convert = str;
  const r = new RegExp(`\\$${prefix}\.[\\w\\d\\.]+`, 'g');
  const replaced: string[] = [];
  let m;
  do {
    m = r.exec(str);
    if (m && !replaced.includes(m[0])) {
      const key = m[0];
      const lookup = key.slice(prefix.length + 2); // + 2 for '$' and '.'
      const value = dot.pick(lookup, data)?.toString();
      if (value) convert = convert.replace(new RegExp(`\\$\.${lookup}`, 'g'), value);
    }
  } while (m);

  return convert;
};
