import { EAdminPageRoot } from './Admin.resolver';
import { ErrorAdminPageRegistered } from './errors';

export class BrixAdmin {
  _pages: {
    [prefix: string]: EAdminPageRoot;
  } = {};

  register(options: EAdminPageRoot) {
    if (this._pages[options.prefix]) throw new ErrorAdminPageRegistered(options.prefix);
    else {
      this._pages[options.prefix] = options;
    }
  }

  pages() {
    return Object.values(this._pages);
  }
}

if (!global.BrixAdmin) global.BrixAdmin = new BrixAdmin();
