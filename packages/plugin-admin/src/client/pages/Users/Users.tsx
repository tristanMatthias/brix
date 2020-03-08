import './users.page.scss';

import { gql, useQuery } from '@apollo/react-hooks';
import { BrixContextUser } from '@brix/core';
import React from 'react';

import { Card } from '../../components/Card/Card';
import { Header } from '../../components/Header/Header';
import { Page, PageContent } from '../../components/Page/Page';
import { Table } from '../../components/Table/Table';


export const UsersPage = () => {
  const { data, loading } = useQuery<{ users: BrixContextUser[] }>(gql`{users{id firstName lastName email}}`);
  return <Page title="Brix Dashboard" type="users">
    <Header icon="userLine" title="Users" />

    <PageContent>
      <Card style={{ gridColumn: 'span 12' }} padding={0}>
        {data && <Table
          loading={loading}
          selectable
          data={data ? data.users : undefined}
          columns={!data ? [] : [
            {
              Header: 'Name',
              Cell: '$.firstName $.lastName',
              ellipsis: true,
              canSort: true
            },
            { Header: 'Email', accessor: 'email' }
          ]}
        />}
      </Card>
    </PageContent>
  </Page>;
};
