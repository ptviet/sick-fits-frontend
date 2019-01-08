import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';
import DeleteItem from './DeleteItem';
import AddToCart from './AddToCart';

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

const ButtonList = styled.div`
  display: grid;
  width: 100%;
  border-top: 1px solid ${props => props.theme.lightgrey};
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-gap: 1px;
  background: ${props => props.theme.lightgrey};
  & > * {
    background: white;
    border: 0;
    font-size: 1rem;
    padding: 1rem;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      image
      largeImage
    }
  }
`;

class SingleItem extends Component {
  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, error, loading }) => {
          if (error) return <ErrorMessage error={error} />;
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No Item Found.</p>;
          const { item } = data;
          return (
            <>
              <ButtonList>
                <Link
                  href={{
                    pathname: '/update',
                    query: { id: item.id }
                  }}
                >
                  <a>Edit ✏️</a>
                </Link>
                <AddToCart id={item.id} />
                <DeleteItem id={item.id}>Delete ❌</DeleteItem>
              </ButtonList>
              <SingleItemStyles>
                <Head>
                  <title>Sick Fits | {item.title}</title>
                </Head>
                <img src={item.largeImage} alt={item.title} />
                <div className="details">
                  <h2>{item.title}</h2>
                  <h4>{formatMoney(item.price)}</h4>
                  <p>{item.description}</p>
                </div>
              </SingleItemStyles>
            </>
          );
        }}
      </Query>
    );
  }
}

export default SingleItem;
export { SINGLE_ITEM_QUERY };
