import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import wait from 'waait';
import Cart, { LOCAL_STATE_QUERY } from '../components/Cart';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeCartItem, fakeUser } from '../lib/testUtils';

const user = fakeUser();
const cartItem = fakeCartItem();

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...user,
          cart: [cartItem]
        }
      }
    }
  },
  {
    request: { query: LOCAL_STATE_QUERY },
    result: {
      data: {
        cartOpen: true
      }
    }
  }
];

describe('<Cart />', () => {
  let wrapper;
  it('should render and match snapshot', async () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Cart />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(toJson(wrapper.find('header'))).toMatchSnapshot();
    expect(wrapper.find('CartItem')).toHaveLength(1);
  });
});
