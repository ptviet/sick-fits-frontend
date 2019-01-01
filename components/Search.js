import React, { Component } from 'react';
import Router from 'next/router';
import Downshift from 'downshift';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;

class Search extends Component {
  state = {
    items: [],
    loading: false
  };

  onChange = debounce(async (e, apolloClient) => {
    const searchTerm = e.target.value;
    if (searchTerm.length >= 3) {
      await this.setState({ loading: true });
      const searchResults = await apolloClient.query({
        query: SEARCH_ITEMS_QUERY,
        variables: {
          searchTerm
        }
      });
      await this.setState({ items: searchResults.data.items, loading: false });
    }
  }, 750);

  render() {
    return (
      <SearchStyles>
        <div>
          <ApolloConsumer>
            {client => (
              <input
                type="search"
                onChange={e => {
                  e.persist();
                  this.onChange(e, client);
                }}
              />
            )}
          </ApolloConsumer>
          <DropDown>
            {this.state.items.map(item => (
              <DropDownItem key={item.id}>
                <img src={item.image} alt={item.title} width="50" />
              </DropDownItem>
            ))}
          </DropDown>
        </div>
      </SearchStyles>
    );
  }
}

export default Search;
