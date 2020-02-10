import { MailTester } from '../src/MailTester';

describe('MailTester', () => {
  let mt: MailTester;
  let to: string;
  const from = 'fake@local.dev';

  beforeEach(async () => {
    mt = new MailTester();
    await mt.setup();
    to = mt.randomEmail();
  });

  afterEach(async () => {
    mt.close();
  });

  it('should create a SMTP server', async () => {
    expect(mt.port).toEqual(5000);
  });

  it('randomEmail() should create a random email', async () => {
    const email = mt.randomEmail();
    expect(email).toMatch(new RegExp(`${mt.port}-.*@local.dev`));
  });

  it('send() should send a HTML email', async () => {
    expect.assertions(4);
    mt.nextEmail(to).then(email => {
      expect(email.to.text).toEqual(to);
      expect(email.from.text).toEqual(from);
      expect(email.subject).toEqual(undefined);
      expect(email.textAsHtml).toEqual('<p>Hello</p>');
    });
    await mt.send(to, from, 'Hello');
  });

  it('nextEmail() should not resolve for different to address', async () => {
    expect.assertions(2);
    const to1CB = jest.fn();
    const to1 = mt.randomEmail();
    const to2CB = jest.fn();
    const to2 = mt.randomEmail();

    mt.nextEmail(to1).then(to1CB);
    mt.nextEmail(to2).then(to2CB);

    await mt.send(to2, from, 'Anything');

    expect(to1CB).not.toBeCalled();
    expect(to2CB).toBeCalled();
  });

  it('nextEmail() should filter with subject', async () => {
    expect.assertions(2);
    const subject1CB = jest.fn();
    const subject1 = 'Subject 1';
    const subject2CB = jest.fn();
    const subject2 = 'Subject 2';

    mt.nextEmail(to, subject1).then(subject1CB);
    mt.nextEmail(to, subject2).then(subject2CB);

    await mt.send(to, from, 'Anything', subject2);

    expect(subject1CB).not.toBeCalled();
    expect(subject2CB).toBeCalled();
  });


  it('setup() should find available port', async () => {
    const mt1 = mt;
    const mt2 = new MailTester(); await mt2.setup();
    const mt3 = new MailTester(); await mt3.setup();
    const mt4 = new MailTester(); await mt4.setup();
    const mt5 = new MailTester(); await mt5.setup();

    expect(mt5.port).not.toEqual(5000);

    await mt1.close();
    await mt2.close();
    await mt3.close();
    await mt4.close();
    await mt5.close();
  });

  it('should not log anything by default', async () => {
    const old = console.log;
    console.log = jest.fn();

    const noLogger = new MailTester();
    await noLogger.setup();
    expect(console.log).toBeCalledTimes(0);
    await noLogger.close();

    console.log = old;
  });

  it('should enable logging', async () => {
    const old = console.log;
    console.log = jest.fn();

    const logger = new MailTester(true);
    await logger.setup();
    expect(console.log).toBeCalledTimes(4);
    await logger.close();

    console.log = old;
  });
});
