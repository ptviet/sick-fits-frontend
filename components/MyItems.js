import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import User from './User';
import Item from './Item';
import ErrorMessage from './ErrorMessage';

const MY_ITEMS_QUERY = gql`
  query MY_ITEMS_QUERY($id: ID!) {
    items(where: { user: { id: $id } }, orderBy: createdAt_DESC) {
      id
      title
      description
      price
      image
      largeImage
    }
  }
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class MyItems extends Component {
  render() {
    return (
      <User>
        {({ data: { me } }) => {
          if (!me) return <p>Please login.</p>;
          return (
            <Query query={MY_ITEMS_QUERY} variables={{ id: me.id }}>
              {({ data, error, loading }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <ErrorMessage error={error} />;
                return (
                  <>
                    <h2>Your item(s)</h2>
                    {data.items.length === 0 && !loading && (
                      <p>You don't have any item.</p>
                    )}
                    <ItemsList>
                      {data.items.map(item => (
                        <Item key={item.id} item={item} />
                      ))}
                    </ItemsList>
                  </>
                );
              }}
            </Query>
          );
        }}
      </User>
    );
  }
}

export default MyItems;
