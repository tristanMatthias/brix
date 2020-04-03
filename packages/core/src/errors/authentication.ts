// tslint:disable variable-name
import { ErrorCode } from './codes';
import { ErrorBadRequest, ErrorUnauthorized } from './general';

/** You need to be authenticated error (400) */
export class ErrorAuthUnauthenticated extends ErrorUnauthorized {
  code = ErrorCode.AuthUnauthenticated;
  constructor() {
    super('You need to be authenticated');
  }
}

/** Incorrect login details error (400) */
export class ErrorAuthInvalidDetails extends ErrorBadRequest {
  code = ErrorCode.AuthInvalidDetails;
  constructor() {
    super('Incorrect login details');
  }
}

/** Invalid oauth code error (400) */
export class ErrorAuthOauthCode extends ErrorBadRequest {
  code = ErrorCode.ErrorAuthOauthCode;
  constructor() {
    super('Could not login with that code');
  }
}

/** Email is not verified error (400) */
export class ErrorAuthEmailNotVerified extends ErrorBadRequest {
  code = ErrorCode.AuthEmailNotVerified;
  constructor() {
    super('Email is not verified');
  }
}
/** Invalid access token error (401) */
export class ErrorAuthInvalidToken extends ErrorUnauthorized {
  code = ErrorCode.AuthInvalidToken;
  constructor() {
    super('Invalid access token');
  }
}
/** Invalid Authorization header error (400) */
export class ErrorAuthInvalidAuthorizationHeader extends ErrorBadRequest {
  code = ErrorCode.AuthInvalidAuthorizationHeader;
  constructor() {
    super('Invalid Authorization header');
  }
}
/** You do not have access to this resource error (400) */
export class ErrorAuthNoAccess extends ErrorUnauthorized {
  code = ErrorCode.AuthNoAccess;
  constructor(resource: string) {
    super(`You do not have access to this ${resource.toLowerCase()}`);
  }
}
/** Passwords do not match error (400) */
export class ErrorAuthPasswordMismatch extends ErrorBadRequest {
  code = ErrorCode.AuthPasswordMismatch;
  constructor() {
    super('Passwords do not match');
  }
}
/** Incorrect password error (400) */
export class ErrorAuthIncorrectPassword extends ErrorBadRequest {
  code = ErrorCode.AuthIncorrectPassword;
  constructor() {
    super('Incorrect password');
  }
}
