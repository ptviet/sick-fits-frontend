import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import wait from 'waait';
import Nav from '../components/Nav';
import { fakeUser } from '../lib/testUtils';
import { CURRENT_USER_QUERY } from '../components/User';

const notSignedInMocks = [
  {
    // when
    request: { query: CURRENT_USER_QUERY },
    // then
    result: { data: { me: null } }
  }
];

const signedInMocks = [
  {
    // when
    request: { query: CURRENT_USER_QUERY },
    // then
    result: { data: { me: fakeUser() } }
  }
];

describe('<Nav />', () => {
  let wrapper;
  it('should render a minimal nav when signed out', async () => {
    wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    const nav = wrapper.find('ul');
    expect(nav.children().length).toBe(2);
  });

  it('should render a full nav when signed in', async () => {
    wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    const nav = wrapper.find('ul');
    expect(nav.children().length).toBe(6);
  });
});
