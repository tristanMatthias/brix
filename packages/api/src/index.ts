import * as Auth from './lib/auth';
import * as Context from './lib/context';
import * as Database from './lib/database';
import * as Fingerprint from './lib/fingerprint';
import { server as Server } from './server';

export * from './errors';
export * from './types';

namespace API {
  /** Configuration helpers */
  export const server = Server;

  export module lib {
    export const auth = Auth;
    export const context = Context;
    export const database = Database;
    export const fingerprint = Fingerprint;
  }
}

// tslint:disable-next-line no-default-export
export default API;
