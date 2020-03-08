import { EAdminPage } from './Admin.resolver';
import { ErrorAdminPageRegistered } from './errors';

export interface AdminAppOptions extends EAdminPage {
  icon: string;
}

export class BrixAdmin {
  _pages: {
    [path: string]: AdminAppOptions;
  } = {};

  register(options: AdminAppOptions) {
    if (this._pages[options.path]) throw new ErrorAdminPageRegistered(options.path);
    else {
      this._pages[options.path] = options;
    }
  }

  pages() {
    return Object.values(this._pages);
  }
}

if (!global.BrixAdmin) global.BrixAdmin = new BrixAdmin();
