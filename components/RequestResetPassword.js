import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const REQUEST_RESET_PASSWORD_MUTATION = gql`
  mutation REQUEST_RESET_PASSWORD_MUTATION($email: String!) {
    requestResetPassword(email: $email) {
      message
    }
  }
`;

class RequestResetPassword extends Component {
  state = {
    email: ''
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async (e, requestResetPasswordMutation) => {
    e.preventDefault();
    await requestResetPasswordMutation();
    this.setState({
      email: ''
    });
  };

  render() {
    return (
      <Mutation
        mutation={REQUEST_RESET_PASSWORD_MUTATION}
        variables={this.state}
      >
        {(requestResetPassword, { error, loading, called }) => (
          <Form
            method="post"
            onSubmit={e => this.onSubmit(e, requestResetPassword)}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset your password</h2>
              <ErrorMessage error={error} />
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </label>
              <button type="submit">Request!</button>
              {!error && !loading && called && <p>Reset link emailed!</p>}
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default RequestResetPassword;
export { REQUEST_RESET_PASSWORD_MUTATION };
