import * as gen from '@brix/generated';
import chalk from 'chalk';
import ora from 'ora';

export type GenerateType = 'all' | 'TestClient' | 'schema' | 'queries' | 'shapes';

const wrap = (name: string, func: Function) => async () => {
  const colored = chalk.yellow(`@brix/generated/${name}`);
  const spinner = ora(chalk.blue(`Generating ${colored}`)).start();
  try {
    await func();
  } catch (e) {
    spinner.fail(chalk.redBright(`Failed to generated ${colored}`));
    console.error(chalk.redBright(e));
    return;
  }

  spinner.succeed(chalk.green(`Successfully generated ${colored}`));
};

const testClient = wrap('TestClient', gen.generateGQLTestClient);
const schema = wrap('schema', gen.generateSchemaTypes);
const queries = wrap('queries', gen.generateQueries);
const shapes = wrap('schema', gen.generateShapes);


export const generate = async (type?: GenerateType) => {

  switch (type) {
    case 'TestClient':
      await testClient();
      break;
    case 'schema':
      await schema();
      break;
    case 'queries':
      await queries();
      break;
    case 'shapes':
      await shapes();
      break;

    case 'all':
    default:
      await gen.clean();
      await testClient();
      await schema();
      await queries();
      await shapes();
  }
};
