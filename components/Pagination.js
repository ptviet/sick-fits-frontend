import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ data }) => {
      if (data.itemsConnection) {
        const { count } = data.itemsConnection.aggregate;
        const pages = Math.ceil(count / perPage);
        const { page } = props;
        return (
          <PaginationStyles>
            <Head>
              <title>Sick Fits | Page {page}</title>
            </Head>
            <Link
              prefetch
              href={{
                pathname: 'items',
                query: { page: page - 1 }
              }}
            >
              <a className="prev" aria-disabled={page <= 1}>
                Prev
              </a>
            </Link>
            <p>
              Page {page} of <span className="totalPages">{pages}</span>
            </p>
            <p>{count} items total</p>
            <Link
              prefetch
              href={{
                pathname: 'items',
                query: { page: page + 1 }
              }}
            >
              <a className="next" aria-disabled={page >= pages}>
                Next
              </a>
            </Link>
          </PaginationStyles>
        );
      }
      return null;
    }}
  </Query>
);

export default Pagination;
export { PAGINATION_QUERY };
