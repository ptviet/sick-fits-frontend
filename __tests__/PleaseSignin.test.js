import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import wait from 'waait';
import PleaseSignin from '../components/PleaseSignin';
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

describe('<PleaseSignin />', () => {
  let wrapper;
  it('should render the sign in dialog and form to logged out users', async () => {
    wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignin />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.text()).toContain('Please login');
    expect(wrapper.find('SignIn').exists()).toBeTruthy();
  });

  it('should render the child component when the user is logged in', async () => {
    const ChildComponent = () => <p>childComponent</p>;

    wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignin>
          <ChildComponent />
        </PleaseSignin>
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('ChildComponent').exists()).toBeTruthy();
  });
});
