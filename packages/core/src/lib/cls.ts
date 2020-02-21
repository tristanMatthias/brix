import cls, { Namespace } from 'cls-hooked';
import { RequestHandler } from 'express';
import uuid from 'uuid';

import { Config } from '../config';

/**
 * Get (or create if it doesn't exist) the CLS namespace
 * @param namespace String representing the unique namespace for the context.
 * (Defaults to 'brix-namespace')
 */
export const getCLSNamespace = (namespace: string = Config.clsNamespace): Namespace => {
  return cls.getNamespace(namespace) || cls.createNamespace(namespace);
};


export const getFromCLSContext = (key: any, namespace?: string) => {
  const ns = getCLSNamespace(namespace);
  if (ns?.active) return ns.get(key);
};


export const setInCLSContext = (key: any, value: any, namespace?: string) => {
  const ns = getCLSNamespace(namespace);
  if (ns?.active) return ns.set(key, value);
};


export const bindCLSToRequest: RequestHandler = (req, res, next) => {
  const ns = getCLSNamespace();
  ns.bindEmitter(req);
  ns.bindEmitter(res);

  ns.run(() => {
    const correlationId = uuid.v4();
    getCLSNamespace().set('correlationId', correlationId);
    next();
  });
};
