import { graphql } from 'graphql';

import { buildSchema } from './schema';

export interface FragmentData {
  __schema: {
    types: {
      kind: string;
      name: string;
      possibleTypes: { name: string }[];
    }[]
  };
}

/**
 * Queries a GQL endpoint for the union fragments, and return JSON `FragmentData`
 */
export const generateFragments = async () => {
  const schema = await buildSchema(undefined);

  const { data } = await graphql<FragmentData>(schema, `{
    __schema {
      types {
        kind
        name
        possibleTypes {
          name
        }
      }
    }
  }`);

  // Filter out any type information unrelated to unions or interfaces
  const filteredData = data!.__schema.types.filter(
    (type: any) => type.possibleTypes !== null
  );

  data!.__schema.types = filteredData;
  return data!;
};
