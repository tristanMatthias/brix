// tslint:disable variable-name
import { ApolloError } from 'apollo-server-core';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED, NOT_FOUND } from 'http-status';
import { ErrorCode } from './codes';

/** Generic Brix Error */
export class ErrorBase<T = undefined> extends ApolloError {
  brixError = true;
  code: ErrorCode;
  status?: number;
  details: T;
}

/** Generic 500 error */
export class ErrorGeneral<T = undefined> extends ErrorBase<T> {
  constructor(error: string = 'An unknown error occurred') {
    super(error, INTERNAL_SERVER_ERROR.toString());
  }
}

/** Generic Bad Request error (400) */
export class ErrorBadRequest<T = undefined> extends ErrorBase<T> {
  constructor(error: string) {
    super(error, BAD_REQUEST.toString());
  }
}

/** Generic Authorization error (401) */
export class ErrorUnauthorized<T = undefined> extends ErrorBase<T> {
  code = ErrorCode.AuthUnauthorized;
  constructor(error: string = 'You are not authorized for this action') {
    super(error, UNAUTHORIZED.toString());
  }
}

/** Generic Not Found error (404) */
export class ErrorNotFound<T = undefined> extends ErrorBase<T> {
  constructor(error: string = 'Resource not found') {
    super(error, NOT_FOUND.toString());
  }
}
