import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import User from './User';
import ErrorMessage from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      user {
        id
      }
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  onChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(Number(value)) : value;
    this.setState({ [name]: val });
  };

  onSubmit = async (e, updateItemMutation) => {
    e.preventDefault();
    await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
  };

  render() {
    return (
      <User>
        {({ data: { me } }) => {
          if (!me) return <p>Please login.</p>;
          return (
            <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
              {({ data, loading }) => {
                if (loading) return <p>Loading...</p>;
                if (!data.item) return <p>No Item Found.</p>;
                if (data.item.user.id !== me.id)
                  return <p>You do not own this item.</p>;
                return (
                  <Mutation
                    mutation={UPDATE_ITEM_MUTATION}
                    variables={this.state}
                  >
                    {(updateItem, { loading, error }) => (
                      <Form onSubmit={e => this.onSubmit(e, updateItem)}>
                        <ErrorMessage error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                          <label htmlFor="title">
                            Title
                            <input
                              type="text"
                              id="title"
                              name="title"
                              placeholder="Title"
                              defaultValue={data.item.title}
                              required
                              onChange={this.onChange}
                            />
                          </label>
                          <label htmlFor="price">
                            Price
                            <input
                              type="number"
                              id="price"
                              name="price"
                              placeholder="Price"
                              defaultValue={data.item.price}
                              required
                              onChange={this.onChange}
                            />
                          </label>
                          <label htmlFor="description">
                            Description
                            <textarea
                              id="description"
                              name="description"
                              placeholder="Description"
                              defaultValue={data.item.description}
                              required
                              onChange={this.onChange}
                            />
                          </label>
                          <button type="submit">
                            Sav{loading ? 'ing' : 'e'} Changes
                          </button>
                        </fieldset>
                      </Form>
                    )}
                  </Mutation>
                );
              }}
            </Query>
          );
        }}
      </User>
    );
  }
}

export default UpdateItem;
