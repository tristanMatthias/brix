import * as gen from '@brix/generated';
import ora from 'ora';
import chalk from 'chalk';

export const generate = async () => {
  const spinner = ora('Beginning generation').start();

  // TestClient
  spinner.text = `Generating ${chalk.yellow('@brix/generated/TestClient')}`;
  await gen.generateGQLTestClient();
  spinner.succeed(chalk.green(`Successfully generated ${chalk.yellow('@brix/generated/TestClient')}`));

  // schema.gql and schema.d.ts
  spinner.text = `Generating ${chalk.yellow('@brix/generated/schema')}`;
  await gen.generateSchemaTypes();
  spinner.succeed(chalk.green(`Successfully generated ${chalk.yellow('@brix/generated/schema')}`));


  // Queries
  try {
    spinner.text = `Generating ${chalk.yellow('@brix/generated/queries...')}`;
    const queryGenerator = new gen.QueryGenerator();
    await queryGenerator.generate();
    spinner.succeed(chalk.green(`Successfully generated ${chalk.yellow('@brix/generated/queries')}`));

  } catch (e) {
    spinner.fail(chalk.red(e.message));
    return;
  }

  spinner.succeed(chalk.green(`Successfully generated ${chalk.yellow('@brix/generated')}`));
};
