import fs from 'fs';

const load = (path: string) =>
  fs.readFileSync(require.resolve(`@brix/plugin-admin/queries/${path}.gql`)).toString();

const actions = load('actions');
const WidgetButton = load('widgets/WidgetButton');
const WidgetQuery = load('widgets/WidgetQuery');
const WidgetFormField = load('widgets/WidgetFormField');
const WidgetEntityGridItemMap = load('widgets/WidgetEntityGridItemMap');

export default `query ($url: String!) {
  template(url: $url) {
    data {
      ...WidgetFormField
    }
  }
}
${actions}
${WidgetFormField}
${WidgetButton}
${WidgetQuery}
${WidgetEntityGridItemMap}
`;
