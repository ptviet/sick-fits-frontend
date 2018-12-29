import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $image: String
    $largeImage: String
    $price: Int!
  ) {
    createItem(
      title: $title
      description: $description
      image: $image
      largeImage: $largeImage
      price: $price
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  };

  onChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(Number(value)) : value;
    this.setState({ [name]: val });
  };

  data = null;
  onFileChange = e => {
    e.preventDefault();
    const files = e.target.files;
    this.data = new FormData();
    this.data.append('file', files[0]);
    this.data.append('upload_preset', 'sickfits');
    this.previewImage(files[0]);
  };

  previewImage(file) {
    if (file != null || file != undefined) {
      var oFReader = new FileReader();
      oFReader.readAsDataURL(file);

      oFReader.onload = oFREvent => {
        document.getElementById('uploadPreview').src = oFREvent.target.result;
        document.getElementById('uploadPreview').alt = 'Upload Preview';
        document.getElementById('uploadPreview').style = 'height: 100px';
        document.getElementById('uploadPreview').hidden = false;
      };
    } else {
      document.getElementById('uploadPreview').hidden = true;
      this.data = null;
    }
  }

  onSubmit = async (e, createItemMutation) => {
    e.preventDefault();
    if (this.data != null) {
      const uploadRes = await fetch(
        'https://api.cloudinary.com/v1_1/ptviet/image/upload',
        {
          method: 'POST',
          body: this.data
        }
      );
      const file = await uploadRes.json();
      await this.setState({
        image: file.secure_url,
        largeImage: file.eager[0].secure_url
      });
      const res = await createItemMutation();
      Router.push({
        pathname: '/item',
        query: { id: res.data.createItem.id }
      });
    }
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form onSubmit={e => this.onSubmit(e, createItem)}>
            <ErrorMessage error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <img id="uploadPreview" />
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  required
                  onChange={this.onFileChange}
                />
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={this.state.title}
                  required
                  onChange={this.onChange}
                />
              </label>
              <label htmlFor="price">
                Price (in cent)
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  value={this.state.price}
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
                  value={this.state.description}
                  required
                  onChange={this.onChange}
                />
              </label>
              <button type="submit">Submit{loading && 'ting'}</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
