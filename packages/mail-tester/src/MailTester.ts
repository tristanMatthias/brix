// tslint:disable no-console

import getPort from 'get-port';
import { ParsedMail, simpleParser } from 'mailparser';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { Observable, Subscriber } from 'rxjs';
import { SMTPServer, SMTPServerDataStream, SMTPServerSession } from 'smtp-server';
import uuid from 'uuid';

let defaultPort = 5000;
const HOST = '0.0.0.0';

/**
 * A local, in memory mail server to allow testing for emails sent
 */
export class MailTester {

  /** SMTP server port */
  port?: number;

  /** Mapping of email addresses and their received mail */
  emails: { [email: string]: ParsedMail[] } = {};

  private _observe: Observable<ParsedMail>;
  private _notify: Subscriber<ParsedMail>;
  private _server: SMTPServer;
  private _client: Mail;

  constructor(
    public logging: boolean = false
  ) { }


  /**
   * Initialize the mail server on a random available port
   */
  async setup() {
    // Used for watching for emails
    this._observe = new Observable(sub => this._notify = sub);

    return this._createServer();
  }


  /**
   * Waits for an email at the given `to` address
   * @param to Email address to wait for new emails
   * @param subject Email subject to filter for
   */
  nextEmail(to: string, subject?: string): Promise<ParsedMail> {
    return new Promise(res => {
      this._observe.subscribe(email => {
        if (email.to.value[0].address === to) {
          if (!subject || email.subject.includes(subject)) res(email);
        }
      });
    });
  }


  /**
   * Generates a random email with the port embedded.
   * This is then used in `email.ts` to know what server to send to during tests.
   */
  randomEmail() {
    return `${this.port}-${uuid.v4()}@local.dev`;
  }


  /**
   * Sends an email to the local SMTP server
   * @param to Email address to send the email to
   * @param from Email address the email is from
   * @param message Text to send in the email
   * @param subject Subject of the email
   */
  send(to: string, from: string, message: string, subject?: string) {
    return this._client.sendMail({
      to,
      from,
      html: message,
      subject
    });
  }


  /**
   * Stop the email server
   */
  async close() {
    if (this._server) await new Promise(res => this._server.close(res));
    return true;
  }


  /**
   * Save any incoming emails to memory, and notify the Observable for this.nextEmail
   */
  private async _onData(
    stream: SMTPServerDataStream,
    _session: SMTPServerSession,
    callback: (err?: Error) => void
  ) {
    const email = await simpleParser(stream);
    if (!this.emails[email.to.text]) this.emails[email.to.text] = [];
    this.emails[email.to.text].push(email);
    if (this._notify) this._notify.next(email);
    callback();
  }


  /**
   * Create a local SMTP server
   */
  private async _createServer() {
    let attempts = 0;
    let server: SMTPServer;

    /**
     * When running tests in parallel, ports can be conflicted. This loops
     * over ports till it finds one that it can connect to
     */
    while (!this.port && attempts < 100) {
      server = new SMTPServer({
        authOptional: true,
        onData: this._onData.bind(this)
      });

      try {
        this.port = await getPort({ port: defaultPort });
        if (this.logging) this._log(`Attempting to create server at ${this.port}`);


        // Attempt to start the server. If port is in use, increment port and
        // try again.
        await new Promise((res, rej) => {
          server.on('error', err => rej(err));
          server.listen(this.port, HOST, res);
        });

        if (this.logging) this._log(`SMTP Server started at ${this.port}`);


        this._client = createTransport({
          host: HOST,
          ignoreTLS: true,
          port: this.port
        });

        if (this.logging) this._log('Client connected');


      } catch (e) {
        defaultPort += 1;
        attempts += 1;
        this.port = undefined;
      }
    }

    if (!this.port) throw new Error('[MailTester] Could not find free port');
    this._server = server!;

    return this._server;
  }

  private _log(message: string) {
    if (this.logging) console.log('[MailTester]', message);
  }

}
