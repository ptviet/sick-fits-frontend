import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem';
import { fakeItem } from '../lib/testUtils';

Router.router = { push: jest.fn() };

const item = fakeItem();

// Mock the global fetch API
// global.fetch = jest.fn().mockResolvedValue({
//   json: () => ({
//     secure_url: item.image,
//     eager: [{ secure_url: item.image }]
//   })
// });

const mocks = [
  {
    // when
    request: {
      query: CREATE_ITEM_MUTATION,
      variables: {
        title: item.title,
        description: item.description,
        image: '',
        largeImage: '',
        price: item.price
      }
    },
    // then
    result: {
      data: {
        createItem: {
          id: item.id,
          __typename: 'Item'
        }
      }
    }
  }
];

const type = (wrapper, input, name, value) => {
  const element = wrapper.find(`${input}[name="${name}"]`);
  element.prop('onChange')({ target: { name, value } });
};

describe('<CreateItem />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    );
  });
  it('should render and match the snapshot', () => {
    const form = wrapper.find('form');
    expect(toJson(form)).toMatchSnapshot();
  });

  it('should preview the image', async () => {
    const component = wrapper.find('CreateItem').instance();
    expect(component.data).toBeNull();

    const uploadPreview = wrapper.find('#uploadPreview');
    expect(uploadPreview.props().src).toBeUndefined();

    // Mock uploadPreview
    const file = new Blob(['dog.jpg'], { type: 'image/jpg' });
    const readAsDataURL = () => {
      uploadPreview.props().src = item.image;
    };

    const dummyFileReader = {
      readAsDataURL
    };
    const fileUpload = wrapper.find('input[type="file"]');
    window.FileReader = jest.fn(() => dummyFileReader);
    fileUpload.simulate('change', { target: { files: [file] } });

    await wait();
    wrapper.update();

    expect(component.data).not.toBeNull();
    expect(uploadPreview.props().src).toEqual(item.image);
  });

  it('should create an item when the form is submitted', async () => {
    // Simulate input
    type(wrapper, 'input', 'title', item.title);
    type(wrapper, 'textarea', 'description', item.description);
    type(wrapper, 'input', 'price', item.price);

    // component.setState({ image: item.image, largeImage: item.largeImage });

    // expect(component.state).toMatchObject({
    //   title: item.title,
    //   description: item.description,
    //   image: item.image,
    //   largeImage: item.largeImage,
    //   price: item.price
    // });

    // Submit the form
    const form = wrapper.find('form');
    form.simulate('submit');
    await wait(50);
    expect(Router.router.push).toHaveBeenCalled();

    // expect(global.fetch).toHaveBeenCalled();
    // global.fetch.mockreset();
  });
});
