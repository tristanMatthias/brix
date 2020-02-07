import fetch from 'node-fetch';
import fs from 'fs-extra';

const generateFragments = async (
  url = 'http://localhost:4000/graphql',
  dest = './fragments.json'
) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      variables: {},
      query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `
    })
  });
  const { data } = await res.json();

  // Filter out any type information unrelated to unions or interfaces
  const filteredData = data.__schema.types.filter(
    (type: any) => type.possibleTypes !== null
  );

  data.__schema.types = filteredData;
  await fs.writeFile(dest, JSON.stringify(data));
  return data;
};

export default generateFragments;

// File is called from command line
if (require.main === module) generateFragments();
