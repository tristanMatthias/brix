import './styles/app.scss';

import { ApolloProvider as AHooksProvider } from '@apollo/react-hooks';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import { Auth } from './containers/Auth.container';
import { getClient } from './lib/apollo';
import { history } from './lib/history';
import { AppRouter } from './router/AppRouter';
import { Me } from './containers/Me.container';
import { AdminApps } from './containers/AdminApps.container';
import { Picker } from './containers/Picker.container';

(async () =>
  ReactDOM.render(
    // @ts-ignore
    <AHooksProvider client={await getClient()}>
      <Auth.Provider>
        <Me.Provider>
          <AdminApps.Provider>
            <Picker.Provider>
              <Router history={history}>
                <AppRouter />
              </Router>
            </Picker.Provider>
          </AdminApps.Provider>
        </Me.Provider>
      </Auth.Provider>
    </AHooksProvider >,
    document.getElementById('root')
  )
)();
