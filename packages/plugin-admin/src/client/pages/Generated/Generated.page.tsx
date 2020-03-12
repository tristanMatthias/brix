import './generated.page.scss';

import { gql } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';
import { Route, Switch, useParams, Redirect } from 'react-router';

import { Header } from '../../components/Header/Header';
import { Page, PageContent } from '../../components/Page/Page';
import { SideMenu } from '../../components/SideMenu/SideMenu';
import { Widget } from '../../components/Widget/Widget';
import { EAdminPage } from '../../containers/AdminApps.container';
import { getClient } from '../../lib/apollo';
import { linkParams } from '../../router/routes';


export interface GeneratedPageProps {
  page: EAdminPage;
  parentPath?: string;
}
export const GeneratedPage: React.FunctionComponent<GeneratedPageProps> = ({
  page,
  parentPath = ''
}) => {
  if (!page) return null;
  const params = useParams();
  const [pageData, setPageData] = useState();

  const load = async () => {
    if (!page.query) return;
    const client = await getClient();
    const { data } = await client.query({
      query: gql(page.query),
      variables: params
    });
    setPageData(page.queryKey ? data[page.queryKey] : data);
  };

  useEffect(() => {
    load();
  }, [page.query]);

  return <Switch>
    {page.pages?.map((p, i) => <Route
      path={linkParams(`${page.path}${p.path}`)(false)}
      exact
      key={i}
    >
      <GeneratedPage page={p} parentPath={page.path} />
    </Route>)}
    <Route path={linkParams(`${parentPath}${page.path}`)(false)} exact>
      {page.redirect
        ? <Redirect to={linkParams(page.redirect)()} />
        : <Page title={page.title} type="generated">
          {page.header && <Header
            icon={page.header.icon!}
            title={page.header.heading}
            buttons={page.header.buttons}
          />}
          {page.menu && <SideMenu items={page.menu} />}
          <PageContent>
            {page.content.map((c, i) =>
              <Widget widget={c} data={pageData} rootWidget={true} key={i} />
            )}
          </PageContent>
        </Page>
      }
    </Route>
  </Switch>;
};
