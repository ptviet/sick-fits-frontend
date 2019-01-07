import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  // Update the cache on the client to match the server
  update = (cache, payload) => {
    // Read the cache to get the item
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    // Filter the deleted item out of the cart
    data.me.cart = data.me.cart.filter(
      item => item.id !== payload.data.removeFromCart.id
    );
    // Put the items back
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };

  render() {
    const { id } = this.props;
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id }}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id
          }
        }}
      >
        {(removeFromCart, { loading }) => (
          <BigButton
            title="Delete Item"
            onClick={() => {
              removeFromCart().catch(error =>
                alert(error.message.replace('GraphQL error: ', ''))
              );
            }}
            disabled={loading}
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromCart;
export { REMOVE_FROM_CART_MUTATION };
