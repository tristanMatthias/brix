import path from 'path';
import fs from 'fs-extra';
import { Project } from 'ts-morph';

export const tsProject = new Project({
  tsConfigFilePath: path.resolve(__dirname, '../../tsconfig.json'),
  addFilesFromTsConfig: false,
  compilerOptions: {
    outDir: path.resolve(__dirname, '../../'),
    sourceMap: false,
    declaration: true
  }
});


export const compileFile = async (filename: string, source: string) =>
  compile(filename, (await fs.readFile(source)).toString());


export const compile = async (filename: string, contents: string) => {
  const file = tsProject.createSourceFile(filename, contents);
  const result = await file.emit();

  const err = result.getEmitSkipped();
  if (err) {
    throw new Error(`Error in generated ${filename}:\n\n${
      result.getDiagnostics()[0].getMessageText().toString()
      }\n\n`);
  } else return true;
};
