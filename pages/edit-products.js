import {
  Banner,
  Card,
  DisplayText,
  Form,
  FormLayout,
  Select,
  Layout,
  Page,
  PageActions,
  TextField,
  Toast,
  AppProvider,
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-boost';
import { Mutation, ApolloProvider } from 'react-apollo';
import Cookies from 'js-cookie';

const client = new ApolloClient({
  fetchOptions: {
    credentials: 'include'
  }
});

const UPDATE_SCRIPT_TAG = gql`
  mutation scriptTagUpdate($id: ID!, $input: ScriptTagInput!) {
    scriptTagUpdate(id: $id, input: $input) {
      userErrors {
        field
        message
      }
      scriptTag {
        id
      }
    }
  }
`;

class EditProduct extends React.Component {
  state = {
    effectType: '',
    scriptId: '',
    showToast: true,
    shopOrigin: Cookies.get('shopOrigin'),
    selected: 'today',
  };

  componentDidMount() {
    this.setState({ discount: this.setUpItemToBeConsumedByForm() });
  };
  handleChange = (newValue) => {
    this.setState({selected: newValue});
  };

  redirectToHome = () => {
    const redirect = Redirect.create(this.context.polaris.appBridge);
    redirect.dispatch(
      Redirect.Action.APP,
      '/effects/select'
    );
  };

  render() {
    const { effectType, scriptId, showToast } = this.state;
    const options = [
      {label: 'Today', value: 'today'},
      {label: 'Yesterday', value: 'yesterday'},
      {label: 'Last 7 days', value: 'lastWeek'},
    ];

    return (
     <Mutation
       mutation={UPDATE_SCRIPT_TAG}
     >
       {(handleSubmit, {error, data}) => {
        const showError = error && (
          <Banner status="critical">{error.message}</Banner>
        );
        const showToast = data && data.productVariantUpdate && (
          <Toast
            content="Sucessfully updated"
            onDismiss={() => this.setState({ showToast: false })}
          />
        );
        return (
          <Page>
            <Layout>
              {showToast}
              {showError}
              <Layout.Section>
                <DisplayText size="large">Testname</DisplayText>
                <Form>
                  <Card sectioned>
                    <FormLayout>
                      <FormLayout.Group>
                        <TextField
                          prefix="$"
                          value="10.00"
                          disabled={true}
                          label="Original price"
                          type="price"
                        />
                        <TextField
                          prefix="$"
                          value="5.00"
                          onChange={this.handleChange('discount')}
                          label="Discounted price"
                          type="discount"
                        />
                        <Select
                          label="Date range"
                          options={options}
                          onChange={this.handleChange}
                          value={this.state.selected}
                        />
                      </FormLayout.Group>
                      <p>
                        This sale price will expire in two weeks on{' '}
                        {this.props.expires}
                      </p>
                    </FormLayout>
                  </Card>
                  <PageActions
                    primaryAction={[
                      {
                        content: 'Save',
                        onAction: () => {
                          var c = "";
                          filter();
                          function filter(data) {
                            c = data;

                            handleSubmit({
                              variables: {
                                "id": `gid://shopify/ScriptTag/${c}`,
                                "input": {
                                  "src": "https://430ed18a.ngrok.io/js/gadjen_app_bounce.js"
                                }
                              }
                            });
                          }
                          const responseJSON = fetch('/effects/select')
                           .then(response => response.json()) 
                           .then((responseJSON) => {
                              filter(responseJSON.script_tags[0].id);
                              return responseJSON;
                           })
                           .catch(error => console.error('Error:', error))
                        }
                      }
                    ]}
                    secondaryActions={[
                      {
                        content: 'Remove discount'
                      }
                    ]}
                  />
                </Form>
              </Layout.Section>
            </Layout>
          </Page>
        );
       }}
     </Mutation>
    )
  }

  handleChange = field => {
    return value => this.setState({ [field]: value });
  };

  setUpItemToBeConsumedByForm = () => {
    const item = store.get('item');
    const price = item.variants.edges[0].node.price;
    const variantId = item.variants.edges[0].node.id;
    const discounter = price * 0.1;
    this.setState({ price: price, variantId: variantId });
    return (price - discounter).toFixed(2);
  };
}

export default EditProduct;