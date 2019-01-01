import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import RemoveFromCart from './RemoveFromCart';

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
      {cartItem.item ? (
        <>
          <img
            src={cartItem.item.image}
            alt={cartItem.item.title}
            width="100"
          />
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
        </>
      ) : (
        <p>Item has been removed by the seller.</p>
      )}
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  );
};

export default CartItem;
