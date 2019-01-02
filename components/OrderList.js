import React, { Component } from 'react';
import Link from 'next/link';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
// import { formatDistance } from 'date-fns';
import styled from 'styled-components';
import { format } from 'date-fns';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from './styles/OrderItemStyles';
import ErrorMessage from './ErrorMessage';

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        description
        price
        image
        largeImage
        quantity
      }
    }
  }
`;

const OrderUL = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
`;

class OrderList extends Component {
  render() {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {({ data: { orders }, error, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <ErrorMessage error={error} />;
          if (orders.length === 0)
            return <p>You have not ordered anything yet!</p>;
          return (
            <div>
              <h2>
                You have {orders.length} order{orders.length > 1 && 's'}
              </h2>
              <OrderUL>
                {orders.map(order => (
                  <OrderItemStyles key={order.id}>
                    <Link
                      href={{
                        pathname: '/order',
                        query: { id: order.id }
                      }}
                    >
                      <a>
                        <div className="order-meta">
                          <p>{format(order.createdAt, 'DD/MM/YYYY')}</p>
                          {/* <p>
                              {'('}
                              {formatDistance(order.createdAt, new Date())}
                              {')'}
                            </p> */}
                          <p>
                            {order.items.reduce((a, b) => a + b.quantity, 0)}
                            {' Items'}
                          </p>
                          <p>
                            {order.items.length}
                            {' Product'}
                            {order.items.length > 1 && 's'}
                          </p>
                          <p>{formatMoney(order.total)}</p>
                        </div>
                        <div className="images">
                          {order.items.map(item => (
                            <img
                              key={item.id}
                              src={item.image}
                              alt={item.title}
                            />
                          ))}
                        </div>
                      </a>
                    </Link>
                  </OrderItemStyles>
                ))}
              </OrderUL>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default OrderList;
