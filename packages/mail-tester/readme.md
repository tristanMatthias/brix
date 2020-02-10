# Local Mail Tester

This project is designed for testing emails in your app. It contains a SMTP server
that listens for emails to validate your API is sending the correct information.

## Installation and usage
Install `mail-tester` with npm or yarn
```sh
yarn add @brix/mail-tester
```

Once installed, import it with:

```ts
import {MailTester} from '@brix/mail-tester';

(async() => {
  const mt = new MailTester();
  await mt.setup();
  const to = mt.randomEmail();

  mt.nextEmail(to).then(email => {
    console.log(email.textAsHtml);
    mt.close();
  });

  await mt.send(to, 'fake@email.com', 'Hello', 'Some subject');

})();
```


## API

### `new MailTester()`
This will generate an instance of a `MailTester`. You can enable logging by passing `true`.

```ts
const mt = new MailTester(true) // Enables logging
```

### `MailTester.setup(): Promise<SMTPServer>`
Once you've constructed the MailTester, the `setup()` function will create the
SMTP server and client. By default it attempts to setup on port `5000`, however if
this is not free, it will look for another available port


### `MailTester.nextEmail(to: string, subject?: string): Promise<ParsedMail>`
This function returns a promise that resolves when an email has been sent.

`to`: Is the email address to listen for. If no subject is passed, this function will return with **the first** email it receives
`subject`: If this is passed, the function will only resolve if the `to` address recieves an email with this subject


### `MailTester.randomEmail(): string;`
Generates a random email with the port of the SMTP server and a UUID

```ts
const email = mt.randomEmail()
// 5000-46c9954c-b732-4f2d-8d52-dd8ad5a2eb23@local.dev
```

### `MailTester.send(to: string, from: string, message: string, subject?: string): Promise<any>;`
Sends an email to the local SMTP server

`to` Email address to send the email to
`from` Email address the email is from
`message` Text to send in the email
`subject` Subject of the email


### `MailTester.close(): Promise<boolean>`
Stop the email server
