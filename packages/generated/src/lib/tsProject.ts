import path from 'path';
import fs from 'fs-extra';
import { Project } from 'ts-morph';

export const tsProject = new Project({
  tsConfigFilePath: path.resolve(__dirname, '../../tsconfig.json'),
  addFilesFromTsConfig: false,
  compilerOptions: {
    outDir: path.resolve(__dirname, '../../'),
    sourceMap: false
  }
});


export const compileFile = async (filename: string, source: string) =>
  compile(filename, (await fs.readFile(source)).toString());


export const compile = async (filename: string, contents: string) => {
  const file = tsProject.createSourceFile(filename, contents);
  return file.emit();
};
