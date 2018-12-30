import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3 {
    margin: 0;
  }
`;

const CartItem = ({ cartItem }) => {
  return (
    <CartItemStyles>
      <img src={cartItem.item.image} alt={cartItem.item.title} width="100" />
      <div className="cart-item-details">
        <h3>{cartItem.item.title}</h3>
        <p>
          <em>
            {cartItem.quantity} &times; {formatMoney(cartItem.item.price)}
            {' (each)'}
          </em>
          {' = '}
          {formatMoney(cartItem.item.price * cartItem.quantity)}
        </p>
      </div>
    </CartItemStyles>
  );
};

export default CartItem;
