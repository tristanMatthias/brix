import * as gen from '@brix/generated';
import chalk from 'chalk';
import ora from 'ora';

export type GenerateType = 'all' | 'TestClient' | 'schema' | 'queries' | 'shapes';

const wrap = (name: string, func: Function) => async (progress: boolean = true) => {
  let spinner;
  const colored = chalk.yellow(`@brix/generated/${name}`);
  if (progress) spinner = ora(chalk.blue(`Generating ${colored}`)).start();
  try {
    await func();
  } catch (e) {
    spinner?.fail(chalk.redBright(`Failed to generated ${colored}`));
    throw e;
  }

  spinner?.succeed(chalk.green(`Successfully generated ${colored}`));
};

const testClient = wrap('TestClient', gen.generateGQLTestClient);
const schema = wrap('schema', gen.generateSchemaTypes);
const queries = wrap('queries', gen.generateQueries);
const shapes = wrap('schema', gen.generateShapes);


export const generate = async (type?: GenerateType, progress = true) => {

  switch (type) {
    case 'TestClient':
      await testClient(progress);
      break;
    case 'schema':
      await schema(progress);
      break;
    case 'queries':
      await queries(progress);
      break;
    case 'shapes':
      await shapes(progress);
      break;

    case 'all':
    default:
      await gen.clean();
      await testClient(progress);
      await schema(progress);
      await queries(progress);
      await shapes(progress);
  }

  return true;
};
