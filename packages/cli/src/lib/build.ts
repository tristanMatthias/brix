import ora from 'ora';
import * as yarn from 'yarn-programmatic';

export const build = async (dir: string = process.cwd()) => {
  const project = dir.split('/').pop();
  const spinner = ora(`Building ${project}`).start();
  await yarn.run('build', [], { cwd: dir });
  spinner.text = `Built ${project}`;
  spinner.succeed();
};
