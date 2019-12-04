import React from 'react';
import { Route, Switch } from 'react-router';
import { Router } from 'react-router-dom';

import { HomePage } from '../pages/Home/Home.page';
import { history } from './history';


export const AppRouter = () =>
  <Router history={history}>
    <Switch>
      <Route component={HomePage} />
    </Switch>
  </Router>;
