import './styles/app.scss';

import { ApolloProvider as AHooksProvider } from '@apollo/react-hooks';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import { Auth } from './containers/Auth.container';
import { client } from './lib/apollo';
import { history } from './lib/history';
import { AppRouter } from './router/AppRouter';
import { Me } from './containers/Me.container';

ReactDOM.render(
  // @ts-ignore
  <AHooksProvider client={client}>
    <Auth.Provider>
      <Me.Provider>
        <Router history={history}>
          <AppRouter />
        </Router>
      </Me.Provider>
    </Auth.Provider>
  </AHooksProvider >,
  document.getElementById('root')
);
