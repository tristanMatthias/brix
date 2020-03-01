import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';

import { CONFIG } from '../config';
import { getLocalToken } from './localStorage';
import { ApolloError } from '@apollo/react-hooks';

const authLink = setContext((_, ctx) => {
  const token = getLocalToken();
  return {
    headers: {
      ...ctx.headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

export const getGQLError = (err?: ApolloError | ApolloError[]) => {
  if (!err) return;
  const gqlE = (err instanceof Array) ? err[0] : err;
  return gqlE.graphQLErrors[0].message;
};


const cache = new InMemoryCache({
  dataIdFromObject: (object: any) => {
    switch (object.__typename) {
      default:
        if (object.id) {
          return `${object.__typename}.${object.id}`;
        }
        return;
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(
    ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) => {
            console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
          });
        }
        if (networkError) console.error(`[Network error]: ${networkError}`);
      }),
      createUploadLink({
        uri: `${CONFIG.apiUrl}`,
        credentials: 'include'
      })
    ])),
  cache
});
