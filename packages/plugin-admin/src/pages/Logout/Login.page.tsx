import { Auth } from '../../containers/Auth.container';


export const LogoutPage = () => {
  const { signOut } = Auth.useContainer();

  signOut();
  return null;
};
