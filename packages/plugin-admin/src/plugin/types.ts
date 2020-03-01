import { BrixAdmin } from './Admin';

declare global {
  namespace NodeJS {
    interface Global {
      BrixAdmin: BrixAdmin;
    }
  }
}
