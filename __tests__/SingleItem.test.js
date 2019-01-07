import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import SingleItem, { SINGLE_ITEM_QUERY } from '../components/SingleItem';
import { fakeItem } from '../lib/testUtils';

describe('<SingleItem />', () => {
  let wrapper;
  let mocks;

  it('should render with proper data', async () => {
    mocks = [
      {
        // when
        request: { query: SINGLE_ITEM_QUERY, variables: { id: fakeItem().id } },
        // then
        result: { data: { item: fakeItem() } }
      }
    ];

    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id={fakeItem().id} />
      </MockedProvider>
    );

    expect(wrapper.text()).toContain('Loading...');

    await wait();
    wrapper.update();

    expect(toJson(wrapper.find('h2'))).toMatchSnapshot();
    expect(toJson(wrapper.find('img'))).toMatchSnapshot();
    expect(toJson(wrapper.find('p'))).toMatchSnapshot();
  });

  it('should show an error with a not found item', async () => {
    mocks = [
      {
        // when
        request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
        // then
        result: { errors: [{ message: 'Item not found!' }] }
      }
    ];

    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    const item = wrapper.find('[data-test="graphql-error"]');

    expect(item.text()).toContain('Item not found!');
    expect(toJson(item)).toMatchSnapshot();
  });
});
