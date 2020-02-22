import { Readable } from 'stream';

import * as Errors from './errors';
import * as Auth from './lib/auth';
import * as Context from './lib/context';
import * as Database from './lib/database';
import * as Fingerprint from './lib/fingerprint';
import { generateFragments as GenerateFragments } from './lib/generateFragments';
import * as GenerateSchemaFile from './lib/generateSchemaFile';
import { GraphQLJSON as gqlJson } from './lib/GraphQLJSON';
import * as Schema from './lib/schema';
import { server as Server } from './server';


export * from './types';

/**
 * Upload class as per graphql-upload
 * @see https://github.com/jaydenseric/graphql-upload#type-fileupload
 */
export class Upload {
  /** Name of the uploaded file */
  filename: string;
  /** File MIME type. Provided by the client and can’t be trusted. */
  mimetype: string;
  /** File stream transfer encoding. */
  encoding: string;
  /**
   * Creates a [Node.js readable stream](https://nodejs.org/api/stream.html#stream_readable_streams)
   * of the file’s contents, for processing and storage.
  */
  createReadStream: () => Readable;
}

namespace API {
  /** Configuration helpers */
  export const server = Server;
  export const errors = Errors;

  export const GraphQLJSON = gqlJson;

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
