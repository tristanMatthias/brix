import { Readable } from 'stream';

import * as Config from './config/types';
import * as Errors from './errors';
import * as Auth from './lib/auth';
import * as Context from './lib/context';
import * as Database from './lib/database';
import * as Fingerprint from './lib/fingerprint';
import { generateFragments as GenerateFragments } from './lib/generateFragments';
import * as GenerateSchemaFile from './lib/generateSchemaFile';
import * as Logger from './lib/logger';
import * as OAuth from './lib/OAuthProvider';
import * as Schema from './lib/schema';
import * as Tokens from './lib/tokens';
import { BaseModel } from './models/BaseModel';
import { User as UserModel } from './models/User';
import { server as Server } from './server';
import { BaseService } from './services/BaseService';
import { UserService } from './services/UserService';
import { GraphQLJSON as gqlJson } from './lib/GraphQLJSON';


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
  export const config = Config;
  export const server = Server;
  export const errors = Errors;

  export const GraphQLJSON = gqlJson;

  export module services {
    export const Base = BaseService;
    export const User = UserService;
  }

  export module lib {
    export const auth = Auth;
    export const context = Context;
    export const database = Database;
    export const fingerprint = Fingerprint;
    export const generateSchemaFile = GenerateSchemaFile;
    export const generateFragments = GenerateFragments;
    export const logger = Logger;
    export const oAuth = OAuth;
    export const tokens = Tokens;
    export const schema = Schema;
  }

  export module models {
    export const Base = BaseModel;
    export const User = UserModel;
  }

}

// tslint:disable-next-line no-default-export
export default API;
