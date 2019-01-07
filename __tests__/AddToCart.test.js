import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import wait from 'waait';
import { ApolloConsumer } from 'react-apollo';
import AddToCart, { ADD_TO_CART_MUTATION } from '../components/AddToCart';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeCartItem, fakeUser } from '../lib/testUtils';

global.alert = jest.fn();

const user = fakeUser();
const cartItem = fakeCartItem();

const mocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: { ...user, cart: [] }
      }
    }
  },
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: { ...user, cart: [cartItem] }
      }
    }
  },
  {
    request: {
      query: ADD_TO_CART_MUTATION,
      variables: { id: cartItem.item.id }
    },
    result: {
      data: {
        addToCart: {
          ...cartItem,
          quantity: 1
        }
      }
    }
  }
];

describe('<AddToCart />', () => {
  let wrapper;
  it('should render and match snapshot', async () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id={cartItem.item.id} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    expect(toJson(wrapper.find('button'))).toMatchSnapshot();
  });

  it('should change from add to adding when clicked', async () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id={cartItem.item.id} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain('Add To Cart');

    // Add an item to the cart
    wrapper.find('button').simulate('click');
    expect(wrapper.text()).toContain('Adding');
  });

  it('should add an item to cart when clicked', async () => {
    let apolloClient;
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <AddToCart id={cartItem.item.id} />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    const {
      data: { me }
    } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(me).toMatchObject(user);
    expect(me.cart).toHaveLength(0);

    // Add an item to the cart
    const button = wrapper.find('#addToCartBtn');
    button.prop('onClick')();
    await wait(50);

    // Check if the item is in the cart
    // Refetch
    const res = await apolloClient.query({ query: CURRENT_USER_QUERY });
    const currentUser = res.data.me;
    expect(currentUser.cart).toHaveLength(1);
    expect(currentUser.cart[0].id).toBe(cartItem.id);
    expect(currentUser.cart[0].quantity).toBe(cartItem.quantity);
  });
});
