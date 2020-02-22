import { Location } from 'history';
import React from 'react';
import { Redirect, Route, RouteProps, Switch, useHistory } from 'react-router';

import { AppGrid } from '../components/AppGrid/AppGrid';
import { Loader } from '../components/Loader/Loader';
import { Auth } from '../containers/Auth.container';
import { Me } from '../containers/Me.container';
import { HomePage } from '../pages/Home/Home.page';
import { LoginPage } from '../pages/Login/Login.page';
import { LogoutPage } from '../pages/Logout/Login.page';
import { UsersPage } from '../pages/Users/Users';
import { routes } from './routes';

const getLoginRedirect = (_location: Location) => {
  // if (location.state?.referrer) {
  //   return location.state?.referrer;
  // }
  return routes.home();
};

const AuthRoute: React.FunctionComponent<RouteProps> = props => {
  const { status } = Auth.useContainer();
  const history = useHistory();
  const { loading, called } = Me.useContainer();

  if (status === 'signedOut') history.push(routes.login());
  if ((status === 'signingIn' || status === 'verifying') || !called || loading) return <Loader />;

  return <Route {...props} />;
};


const UnAuthRoute: React.FunctionComponent<RouteProps> = props => {
  const { status } = Auth.useContainer();
  const history = useHistory();

  if (status === 'verifying') return <Loader />;
  if (status === 'signedIn') history.push(getLoginRedirect(history.location));
  return <Route {...props} />;
};

export const AppRouter = () =>
  <Switch>
    <UnAuthRoute path={routes.login(false)} component={LoginPage} />

    <AuthRoute path="*">
      <AppGrid>
        <Switch>
          <Route exact path={routes.home(false)} component={HomePage} />
          <Route exact path={routes.logout(false)} component={LogoutPage} />
          <Route exact path={routes.users(false)} component={UsersPage} />
          <Redirect to={routes.home(false)} />
        </Switch>
      </AppGrid>
    </AuthRoute>
  </Switch>;
