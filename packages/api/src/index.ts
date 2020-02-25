import * as Errors from './errors';
import * as Auth from './lib/auth';
import * as Context from './lib/context';
import * as Database from './lib/database';
import * as Fingerprint from './lib/fingerprint';
import { generateFragments as GenerateFragments } from './lib/generateFragments';
import * as GenerateSchemaFile from './lib/generateSchemaFile';
import * as Schema from './lib/schema';
import { server as Server } from './server';


export * from './types';

namespace API {
  /** Configuration helpers */
  export const server = Server;
  export const errors = Errors;

  export module lib {
    export const auth = Auth;
    export const context = Context;
    export const database = Database;
    export const fingerprint = Fingerprint;
    export const generateSchemaFile = GenerateSchemaFile;
    export const generateFragments = GenerateFragments;
    export const schema = Schema;
  }
}

// tslint:disable-next-line no-default-export
export default API;
