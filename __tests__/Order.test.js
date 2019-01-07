import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import wait from 'waait';
import Order, { SINGLE_ORDER_QUERY } from '../components/Order';
import { fakeOrder } from '../lib/testUtils';

const order = fakeOrder();

const mocks = [
  {
    request: { query: SINGLE_ORDER_QUERY, variables: { id: order.id } },
    result: {
      data: {
        order
      }
    }
  }
];

describe('<Order/>', () => {
  let wrapper;
  it('should render and match snapshot', async () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id={order.id} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    expect(toJson(wrapper.find('div[data-test="order"]'))).toMatchSnapshot();
  });
});
