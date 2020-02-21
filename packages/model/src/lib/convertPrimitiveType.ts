import { FieldType } from '../decorators';

/**
 * Maps a Javascript primitive datatype to a `FieldType`
 * @param type Primitive data type (string, number, boolean, etc)
 */
export const convertPrimitiveType = (type: any): FieldType | false => {
  switch (type) {
    case String:
      return FieldType.STRING;
    case Number:
      return FieldType.INTEGER;
    case Boolean:
      return FieldType.BOOLEAN;
    case Date:
      return FieldType.DATE;
    default:
      return false;
  }
};
