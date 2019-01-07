import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import wait from 'waait';
import { ApolloConsumer } from 'react-apollo';
import RemoveFromCart, {
  REMOVE_FROM_CART_MUTATION
} from '../components/RemoveFromCart';
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
        me: { ...user, cart: [cartItem] }
      }
    }
  },
  {
    request: {
      query: REMOVE_FROM_CART_MUTATION,
      variables: { id: cartItem.id }
    },
    result: {
      data: {
        removeFromCart: {
          id: cartItem.id,
          __typename: 'CartItem'
        }
      }
    }
  }
];

describe('<RemoveFromCart />', () => {
  let wrapper;
  it('should render and match snapshot', async () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RemoveFromCart id={cartItem.id} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    expect(toJson(wrapper.find('button'))).toMatchSnapshot();
  });

  it('should remove the item from cart when clicked', async () => {
    let apolloClient;
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <RemoveFromCart id={cartItem.id} />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    const {
      data: { me }
    } = await apolloClient.query({ query: CURRENT_USER_QUERY });

    expect(me.cart).toHaveLength(1);
    expect(me.cart[0].item.price).toBe(cartItem.item.price);
    // Remove an item from the cart
    wrapper.find('button').simulate('click');
    await wait();

    const {
      data: { me: currentUser }
    } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(currentUser.cart).toHaveLength(0);
  });
});
