import { ApolloError } from '@apollo/react-hooks';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import axios from 'axios';

import { CONFIG } from '../config';
import { getLocalToken } from './localStorage';

const { buildAxiosFetch } = require('@lifeomic/axios-fetch');

const getFragmentMatcher = async () => {
  const data = await (await fetch(`${CONFIG.prefix}/fragments.json`)).json();
  return new IntrospectionFragmentMatcher({
    introspectionQueryResultData: data
  });
};

const authLink = setContext((_, ctx) => {
  const token = getLocalToken();
  return {
    headers: {
      ...ctx.headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const uploadLink = createUploadLink({
  uri: CONFIG.apiUrl,
  fetch: buildAxiosFetch(axios, (config: any, _input: any, init: any) => ({
    ...config,
    onUploadProgress: init.onUploadProgress
  })),
  credentials: 'include'
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }
  if (networkError) console.error(`[Network error]: ${networkError}`);
});


const getCache = async () =>
  new InMemoryCache({
    dataIdFromObject: (object: any) => {
      switch (object.__typename) {
        default:
          if (object.id) return `${object.__typename}.${object.id}`;
          return;
      }
    },
    fragmentMatcher: await getFragmentMatcher()
  });

let client: ApolloClient<any>;
export const getClient = async () => {
  if (client) return client;
  return client = new ApolloClient({
    link: authLink.concat(
      ApolloLink.from([
        errorLink,
        uploadLink
      ])),
    cache: await getCache()
  });
};


export const getGQLError = (err?: ApolloError | ApolloError[]) => {
  if (!err) return;
  const gqlE = (err instanceof Array) ? err[0] : err;
  return gqlE.graphQLErrors[0].message;
};
