import React, { Component } from 'react';
import Router from 'next/router';
import Downshift, { resetIdCounter } from 'downshift';
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
    submitted: false,
    loading: false
  };

  onChange = debounce(async (e, apolloClient) => {
    const searchTerm = e.target.value;
    if (searchTerm.length >= 3) {
      await this.setState({ loading: true, submitted: true });
      const searchResults = await apolloClient.query({
        query: SEARCH_ITEMS_QUERY,
        variables: {
          searchTerm
        }
      });
      await this.setState({ items: searchResults.data.items, loading: false });
    } else {
      await this.setState({ submitted: false });
    }
  }, 750);

  goToItem = item => {
    Router.push({
      pathname: '/item',
      query: {
        id: item.id
      }
    });
  };

  render() {
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift
          onChange={this.goToItem}
          itemToString={item => (item === null ? '' : item.title)}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex
          }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search for an item...',
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: e => {
                        e.persist();
                        this.onChange(e, client);
                      }
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {this.state.items.map((item, index) => (
                    <DropDownItem
                      {...getItemProps({ item })}
                      key={item.id}
                      highlighted={index === highlightedIndex}
                    >
                      <img src={item.image} alt={item.title} width="50" />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {!this.state.items.length &&
                    !this.state.loading &&
                    this.state.submitted &&
                    inputValue.length >= 3 && (
                      <DropDownItem>
                        Nothing found for {inputValue}
                      </DropDownItem>
                    )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default Search;
