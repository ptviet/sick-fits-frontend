import React, { Component } from 'react';
import Head from 'next/head';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import MyItems from './MyItems';

const MY_INFO_QUERY = gql`
  query MY_INFO_QUERY {
    me {
      id
      email
      name
    }
  }
`;

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UPDATE_PASSWORD_MUTATION(
    $currentPassword: String!
    $password: String!
    $confirmPassword: String!
  ) {
    updatePassword(
      currentPassword: $currentPassword
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

class MyAccount extends Component {
  state = {
    currentPassword: '',
    password: '',
    confirmPassword: ''
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onUpdatePassword = async (e, updatePasswordMutation) => {
    e.preventDefault();
    if (this.state.password !== this.state.confirmPassword) {
      alert("Your passwords don't match!");
    }
    if (
      this.state.password === this.state.confirmPassword &&
      this.state.currentPassword.length > 0
    ) {
      await updatePasswordMutation();
      this.setState({
        currentPassword: '',
        password: '',
        confirmPassword: ''
      });
      alert('Your password has been changed!');
    }
  };

  render() {
    return (
      <>
        <Head>
          <title>Sick Fits | My Account</title>
        </Head>
        <Query query={MY_INFO_QUERY}>
          {({ data: { me }, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <ErrorMessage error={error} />;
            if (!me) return <p>Please login.</p>;
            return (
              <Mutation
                mutation={UPDATE_PASSWORD_MUTATION}
                variables={{
                  currentPassword: this.state.currentPassword,
                  password: this.state.password,
                  confirmPassword: this.state.confirmPassword
                }}
              >
                {(updatePassword, { error, loading }) => (
                  <Form
                    method="post"
                    onSubmit={e => this.onUpdatePassword(e, updatePassword)}
                  >
                    <fieldset disabled={loading} aria-busy={loading}>
                      <h2>Account Info</h2>
                      <ErrorMessage error={error} />
                      <label htmlFor="email">
                        Email
                        <input
                          disabled
                          type="email"
                          name="email"
                          value={me.email}
                        />
                      </label>
                      <label htmlFor="name">
                        Name
                        <input
                          disabled
                          type="text"
                          name="name"
                          value={me.name}
                        />
                      </label>
                      <label htmlFor="password">
                        Current Password
                        <input
                          type="password"
                          name="currentPassword"
                          placeholder="Current Password"
                          value={this.state.currentPassword}
                          onChange={this.onChange}
                        />
                      </label>
                      <label htmlFor="password">
                        New Password
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={this.state.password}
                          onChange={this.onChange}
                        />
                      </label>
                      <label htmlFor="password">
                        Confirm Password
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={this.state.confirmPassword}
                          onChange={this.onChange}
                        />
                      </label>
                      <button
                        type="submit"
                        disabled={
                          this.state.currentPassword.length === 0 ||
                          this.state.password.length === 0 ||
                          this.state.confirmPassword.length === 0
                        }
                      >
                        Change Password
                      </button>
                    </fieldset>
                  </Form>
                )}
              </Mutation>
            );
          }}
        </Query>
        <MyItems />
      </>
    );
  }
}

export default MyAccount;
