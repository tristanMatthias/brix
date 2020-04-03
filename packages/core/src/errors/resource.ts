// tslint:disable variable-name
import { ErrorCode } from './codes';
import { ErrorBadRequest, ErrorNotFound } from './general';

/** Resource not found error (404) */
export class ErrorResourceNotFound extends ErrorNotFound {
  code = ErrorCode.ResourceNotFound;
  constructor(resourceName: string, value?: string | number, property: string = 'id') {
    super(`No ${resourceName.toLowerCase()} found${value ? ` with ${property} '${value}'` : ''}`);
  }
}

/** Existing resource / unique error (400) */
export class ErrorResourceUnique extends ErrorBadRequest {
  code = ErrorCode.ResourceUnique;
  constructor(
    resourceName: string,
    field: string,
    value: string
  ) {
    super(`A ${resourceName.toLowerCase()} already exists with '${field}' as '${value}'`);
  }
}
