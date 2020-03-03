import fs from 'fs-extra';
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from 'ts-morph';

import { getDir } from './getDir';

let tsProject: Project;

const setup = async () => {
  tsProject = new Project({
    addFilesFromTsConfig: false,
    compilerOptions: {
      outDir: await getDir(),
      rootDir: await getDir('src'),
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
};

export const compileFile = async (filename: string, source: string) =>
  compile(filename, (await fs.readFile(source)).toString());


export const compile = async (filename: string, contents: string) => {
  if (!tsProject) await setup();
  const file = tsProject.createSourceFile(filename, contents, { overwrite: true });
  const result = await file.emit();

  const err = result.getEmitSkipped();
  if (err) {
    throw new Error(`Error in generated ${filename}:\n\n${
      result.getDiagnostics()[0].getMessageText().toString()
      }\n\n`);
  } else return true;
};
