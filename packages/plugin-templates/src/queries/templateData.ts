import fs from 'fs';

const load = (path: string) =>
  fs.readFileSync(require.resolve(`@brix/plugin-admin/queries/${path}.gql`)).toString();

const WidgetButton = load('widgets/WidgetButton');
const WidgetQuery = load('widgets/WidgetQuery');
const formFields = load('widgets/formFields');

export default `query ($url: String!) {
  template(url: $url) {
    data {
      ${formFields}
    }
  }
}
${WidgetButton}
${WidgetQuery}
`;
