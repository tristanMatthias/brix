import { BrixAdmin } from './Admin';
export * from './widgets/Widget.union';
export * from './widgets/fields/FormField.union';

declare global {
  namespace NodeJS {
    interface Global {
      BrixAdmin: BrixAdmin;
    }
  }
}
