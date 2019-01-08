import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import Pagination, { PAGINATION_QUERY } from '../components/Pagination';

Router.router = {
  push() {},
  prefetch() {}
};

const makeMocks = length => [
  {
    // when
    request: { query: PAGINATION_QUERY },
    // then
    result: {
      data: {
        itemsConnection: {
          __typename: 'aggregate',
          aggregate: {
            __typename: 'count',
            count: length
          }
        }
      }
    }
  }
];

describe('<Pagination/>', () => {
  let wrapper;
  // it('should display a loading message', async () => {
  //   wrapper = mount(
  //     <MockedProvider mocks={makeMocks(1)}>
  //       <Pagination page={1} />
  //     </MockedProvider>
  //   );

  //   expect(wrapper.text()).toContain('Loading');
  // });

  it('should render pagination for 30 items', async () => {
    wrapper = mount(
      <MockedProvider mocks={makeMocks(30)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    expect(wrapper.find('.totalPages').text()).toEqual('5');

    const pagination = wrapper.find('PaginationStyles');
    expect(toJson(pagination)).toMatchSnapshot();
  });

  it('should disable prev button on first page', async () => {
    wrapper = mount(
      <MockedProvider mocks={makeMocks(30)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBeTruthy();
    expect(wrapper.find('a.next').prop('aria-disabled')).toBeFalsy();
  });

  it('should disable next button on last page', async () => {
    wrapper = mount(
      <MockedProvider mocks={makeMocks(30)}>
        <Pagination page={5} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBeFalsy();
    expect(wrapper.find('a.next').prop('aria-disabled')).toBeTruthy();
  });

  it('should enable all buttons on a middle page', async () => {
    wrapper = mount(
      <MockedProvider mocks={makeMocks(30)}>
        <Pagination page={3} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBeFalsy();
    expect(wrapper.find('a.next').prop('aria-disabled')).toBeFalsy();
  });
});
