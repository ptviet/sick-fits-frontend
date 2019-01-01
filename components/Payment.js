import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import NProgress from 'nprogress';
import ErrorMessage from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';
import calcTotalPrice from '../lib/calcTotalPrice';
import { stripe_publishable_key, paymentIcon } from '../config';

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      total
      charge
      items {
        id
        title
      }
    }
  }
`;

class Payment extends Component {
  totalItems = cart => {
    return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
  };

  onToken = async (res, createOrderMutation) => {
    if (res.id) {
      const order = await createOrderMutation({
        variables: {
          token: res.id
        }
      }).catch(error => alert(error.message.replace('GraphQL error: ', '')));
      console.log(order);
    }
  };

  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {createOrder => (
              <StripeCheckout
                amount={calcTotalPrice(me.cart)}
                name="Sick Fits"
                description={`Order of ${this.totalItems(me.cart)} item${
                  this.totalItems(me.cart) > 1 ? 's' : ''
                }`}
                image={paymentIcon}
                stripeKey={stripe_publishable_key}
                currency="AUD"
                email={me.email}
                token={res => this.onToken(res, createOrder)}
              >
                {this.props.children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    );
  }
}

export default Payment;
