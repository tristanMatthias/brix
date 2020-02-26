import { BrixPlugins } from '@brix/core';


export default () => {
  BrixPlugins.register({
    name: 'Auth',
    contextMiddlewares: [(req, ctx) => {
      if (req.headers.authorization) ctx.accessToken = req.headers.authorization;
      return ctx;
    }],
    authCheckers: [
      async (_ctx, _roles) => { return true; },
      (ctx, _roles) => {
        if (ctx.accessToken) return ctx.accessToken === 'valid';
        return true;
      }
    ]
  });
};
