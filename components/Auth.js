import React, { Component } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import User from './User';
import SignUp from './SignUp';
import SignIn from './SignIn';
import RequestResetPassword from './RequestResetPassword';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

class Auth extends Component {
  render() {
    return (
      <User>
        {({ data: { me } }) => {
          if (me)
            Router.push({
              pathname: '/'
            });
          return (
            <Columns>
              <SignUp />
              <SignIn />
              <RequestResetPassword />
            </Columns>
          );
        }}
      </User>
    );
  }
}

export default Auth;
