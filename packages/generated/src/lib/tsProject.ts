import path from 'path';
import fs from 'fs-extra';
import { Project, ScriptTarget, ModuleKind, ModuleResolutionKind } from 'ts-morph';
import { } from 'typescript';

export const tsProject = new Project({
  addFilesFromTsConfig: false,
  compilerOptions: {
    outDir: path.resolve(__dirname, '../../'),
    rootDir: path.resolve(__dirname, '../../src'),
    declaration: true,
    target: ScriptTarget.ESNext,


    module: ModuleKind.CommonJS,
    strict: true,
    noUnusedLocals: true,
    esModuleInterop: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    resolveJsonModule: true,
    forceConsistentCasingInFileNames: true,
    composite: false,
    sourceMap: true,
    moduleResolution: ModuleResolutionKind.NodeJs,
    removeComments: false,
    noImplicitAny: true,
    strictNullChecks: true,
    strictFunctionTypes: true,
    strictPropertyInitialization: false,
    noImplicitThis: true,
    noUnusedParameters: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true
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
