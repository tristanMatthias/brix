import API from '@brix/api';
import { BrixConfig } from '@brix/core';
import { MailTester } from '@brix/mail-tester';
import { BrixStore } from '@brix/model';
import formData from 'form-data';
import getPort from 'get-port';
import { Server } from 'http';
import fetch from 'isomorphic-fetch';
import { Readable } from 'stream';
import uuid from 'uuid';

// NOTE: Very strange bug with JSON.stringify being re-written on TS compile
const stringify = eval('JSON.stringify');

/** %IMPORT% */

// import { createDatabase, dropDatabase } from '../../src/lib/database';
export class TestClient {

  db: BrixStore;
  emailServer?: MailTester;
  defaultOrganizationId: number;

  /**
   * Unique database for each test client
   */
  private _dbName: string = `brix-test-${uuid.v4()}`;

  private _server: Server;
  private _serverConfig: Partial<BrixConfig>;
  private _url: string;

  // Generated queries and mutations to test
  private _mutations: { [name: string]: string };
  private _queries: { [name: string]: string };
  private _headers: { [name: string]: string } = {};


  private _token?: string;

  constructor(config?: Partial<BrixConfig>) {
    this._serverConfig = config || {};
    try {
      this._mutations = require('./queries/mutations');
    } catch (e) {
      this._mutations = {};
    }
    try {
      this._queries = require('./queries/queries');
    } catch (e) {
      this._queries = {};
    }
  }

  /**
   * Start the API on a random available port and create a test database
   */
  async start(emailServer: boolean = false) {
    const port = await getPort();
    this._url = `http://localhost:${port}/graphql`;

    // TODO: Database integration
    // await createDatabase(this._dbName);

    process.env.DB_DATABASE = this._dbName;

    const { db, httpServer } = await API.server({
      ...this._serverConfig,
      port,
      rootDir: process.cwd()
    });

    this.db = db!;
    this._server = httpServer;


    if (emailServer) {
      this.emailServer = new MailTester();
      await this.emailServer.setup();
    }
  }


  /**
   * Stop the API and drop the test database
   */
  async stop() {
    if (this.db) await this.db.disconnect();

    // TODO: Database integration
    // await dropDatabase(this._dbName);

    if (this.emailServer) await this.emailServer.close();

    if (this._server) await new Promise(res => this._server.close(res));
  }


  // async resetDb() {
  //   if (this._db) await this._db.sync({ force: true });
  // }


  clearToken() {
    this._token = undefined;
  }

  setHeader(header: string, value: string) {
    this._headers[header] = value;
  }


  // ---------------------------------------------------------------------------
  // ------------------------------------------------------------------- Queries
  // ---------------------------------------------------------------------------
  /** %QUERIES% */

  // ---------------------------------------------------------------------------
  // ------------------------------------------------------------------ Requests
  // ---------------------------------------------------------------------------
  private _getHeaders() {
    const headers: HeadersInit = { ...this._headers };
    if (this._token) headers.authorization = `Bearer ${this._token}`;
    return headers;
  }

  /**
   * Wraps the API with file upload capability
   * Conforms to graphql-multipart spec:
   * https://github.com/jaydenseric/graphql-multipart-request-spec
   *
   * @example
   *  this._request('query', 'competition', {file: {...}});
   *
   * @param type Mutation or Query
   * @param name Name of mutation/query
   * @param variables Query name
   */
  private async _request<Return>(
    type: 'mutation' | 'query',
    name: string,
    variables?: object,
    headers?: object
  ): Promise<Return> {
    // Lookup the query
    const query = (type === 'mutation' ? this._mutations : this._queries)[name];
    if (!query) throw new Error(`[TestClient] No gql file generated for ${type} ${query}`);

    // Extract files into object and set to null on variables
    // SEE: https://github.com/jaydenseric/graphql-multipart-request-spec
    const files = this._extractFiles(variables || {});

    const body = new formData();
    body.append('operations', stringify({ query, variables }));

    // Generate the `map` field for the spec
    const map = Object.keys(files).reduce((obj, key, i) => {
      obj[i + 1] = [key];
      return obj;
    }, {} as any);

    body.append('map', stringify(map));

    // Loop over file object, and append files linked to the map
    Object.values(files).forEach((stream, i) => {
      body.append(
        (i + 1).toString(),
        stream,
        {
          contentType: 'image/png',
          filename: `${uuid.v4()}.png`
        });
    });

    const result = await fetch(this._url, {
      headers: {
        ...this._getHeaders(),
        ...headers
      },
      method: 'post',
      body: body as unknown as FormData
    }).then((r: Response) => r.json());

    // Return if successful with no errors and includes data
    if (!result.errors && result.data) return result.data[name];

    // Throw error matching GraphQL request error format
    const errName = result && result.errors[0] ? result.errors[0].message : 'Unknown error';
    const e = new Error(errName);

    // @ts-ignore
    e.response = result;
    throw e;
  }


  private _extractFiles(
    obj: { [file: string]: null | any },
    path = 'variables',
    returning: { [file: string]: Readable } = {}
  ): { [key: string]: Readable } {
    if (!obj) return {};
    Object.entries(obj)
      .forEach(([key, value]) => {
        const _path = path.length ? `${path}.${key}` : key;

        if (value && value.createReadStream) {
          returning[_path] = value.createReadStream();
          obj[key] = null;
        }

        if (value && typeof value === 'object') {
          return this._extractFiles(value, _path, returning);
        }
      });

    return returning;
  }
}
