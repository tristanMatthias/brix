import './generated.page.scss';

import React from 'react';
import { Route, Switch } from 'react-router';

import { EntityGrid } from '../../components/EntityGrid/EntityGrid';
import { Header } from '../../components/Header/Header';
import { Page, PageContent } from '../../components/Page/Page';
import { EAdminPageRoot } from '../../containers/AdminPages.container';
import { linkParams } from '../../router/routes';


export interface GeneratedPageProps {
  page: EAdminPageRoot;
}
export const GeneratedPage: React.FunctionComponent<GeneratedPageProps> = ({
  page
}) => {
  if (!page) return null;

  return <Switch>
    <Route path={linkParams(page.prefix)()}>
      <Page title="Brix Dashboard" type="generated">
        {page.header && <Header
          icon={page.header.icon!}
          title={page.header.heading}
          buttons={page.header.buttons}
        />}
        <PageContent>
          {page.content.map(c => {
            switch (c.widget) {
              case 'entityGrid':
                return <EntityGrid {...c} style={{ gridColumn: 'span 12' }} />;
              default:
                return null;
            }
          })}
        </PageContent>
      </Page>
    </Route>
  </Switch>;
};
