import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Router from 'next/router';
import NProgress from 'nprogress';
import wait from 'waait';
import Payment from '../components/Payment';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeCartItem, fakeUser, fakeOrder } from '../lib/testUtils';

Router.router = { push: jest.fn() };
NProgress.start = jest.fn();

const user = fakeUser();
const cartItem = fakeCartItem();
const order = fakeOrder();

const createOrderMock = jest.fn().mockResolvedValue({
  data: {
    createOrder: {
      ...order
    }
  }
});

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
  }
];

describe('<Payment />', () => {
  let wrapper;
  it('should render and match snapshot', async () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Payment />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    const StripeCheckoutButton = wrapper.find('StripeCheckout');
    expect(toJson(StripeCheckoutButton)).toMatchSnapshot();
  });

  it('should create an order onToken', async () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Payment />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    const component = wrapper.find('Payment').instance();

    // Call onToken method
    component.onToken({ id: 'abc123' }, createOrderMock);
    expect(createOrderMock).toHaveBeenCalled();
    expect(createOrderMock).toHaveBeenCalledWith({
      variables: { token: 'abc123' }
    });
  });

  it('should turn the progress bar on', async () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Payment />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const component = wrapper.find('Payment').instance();

    // Call onToken method
    component.onToken({ id: 'abc123' }, createOrderMock);

    expect(NProgress.start).toHaveBeenCalled();
  });

  it('should route to the order page when completed', async () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Payment />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const component = wrapper.find('Payment').instance();

    // Call onToken method
    component.onToken({ id: 'abc123' }, createOrderMock);
    expect(Router.router.push).toHaveBeenCalled();
  });
});
