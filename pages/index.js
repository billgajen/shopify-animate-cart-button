import React from 'react';
import {
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  SettingToggle,
  Stack,
  TextField,
  TextStyle,
  Select,
  Banner,
  DisplayText,
  PageActions,
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

class Index extends React.Component {
  state = {
    scriptId: '',
    showToast: true,
    shopOrigin: Cookies.get('shopOrigin'),
    enabled: true,
    selectedEffect: 'shake',
    effectInterval: '10',
  };

  render() {
    const { scriptId, showToast, enabled, selectedEffect, effectInterval } = this.state;
    const contentStatus = enabled ? 'Disable' : 'Enable';
    const textStatus = enabled ? 'enabled' : 'disabled';
    const effectOptions = [
      {label: 'Shake', value: 'shake'},
      {label: 'Bounce', value: 'bounce'},
      {label: 'Wobble', value: 'wobble'},
    ];
    const intervalOptions = [
      {label: '5', value: '5'},
      {label: '10', value: '10'},
      {label: '15', value: '15'},
      {label: '20', value: '20'},
      {label: '25', value: '25'},
      {label: '30', value: '30'},
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
              <Layout.AnnotatedSection
                title="Effect Type"
                description="Change effect type and press save. Please allow couple of minutes to see the changes."
              >
                <Card sectioned>
                  <Form onSubmit={this.handleSubmit}>
                    <FormLayout>
                    <Select
                      label="Effect range"
                      options={effectOptions}
                      onChange={this.handleEffectChange}
                      value={this.state.selectedEffect}
                    />
                    </FormLayout>
                  </Form>
                </Card>
              </Layout.AnnotatedSection>
              <Layout.AnnotatedSection
                title="Effect Interval"
                description="Effect interval in seconds."
              >
                <Card sectioned>
                  <Form onSubmit={this.handleSubmit}>
                    <FormLayout>
                    <Select
                      label="Interval range"
                      options={intervalOptions}
                      onChange={this.handleIntervalChange}
                      value={this.state.effectInterval}
                    />
                    </FormLayout>
                  </Form>
                </Card>
              </Layout.AnnotatedSection>
              <Layout.AnnotatedSection
                title="Enable/Disable App"
                description="Temporarily disable the App"
              >
                <SettingToggle
                  action={{
                    content: contentStatus,
                    onAction: this.handleToggle,
                  }}
                  enabled={enabled}
                >
                  This setting is{' '}
                  <TextStyle variation="strong">{textStatus}</TextStyle>.
                </SettingToggle>
              </Layout.AnnotatedSection>
              </Layout>
              <PageActions
              primaryAction={[
                {
                  content: 'Save',
                  onAction: () => {
                    var effect = this.state.selectedEffect;
                    var interval = this.state.effectInterval;
                    var c = "";
                    filter();
                    function filter(data) {
                      c = data;

                      handleSubmit({
                        variables: {
                          "id": `gid://shopify/ScriptTag/${c}`,
                          "input": {
                            "src": `https://300c21c2.ngrok.io/js/gadjen_app_bounce.js?effect=${effect}&interval=${interval}`
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
              />
            </Page>
          );
        }}
      </Mutation>
    )
  }
  handleSubmit = () => {
    this.setState({
      discount: this.state.discount,
    });
    console.log('submission', this.state);
  };
  handleEffectChange = (effect) => {
    this.setState({selectedEffect: effect});
  };
  handleIntervalChange = (interval) => {
    this.setState({effectInterval: interval});
  };

   handleToggle = () => {
    this.setState(({ enabled }) => {
      return { enabled: !enabled };
    });
  };
}

export default Index;