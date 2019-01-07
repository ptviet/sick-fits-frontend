import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import wait from 'waait';
import RequestResetPassword, {
  REQUEST_RESET_PASSWORD_MUTATION
} from '../components/RequestResetPassword';

const mocks = [
  {
    // when
    request: {
      query: REQUEST_RESET_PASSWORD_MUTATION,
      variables: { email: 'ptviet@live.com' }
    },
    // then
    result: {
      data: {
        requestResetPassword: {
          message: 'Request sent.',
          __typename: 'Message'
        }
      }
    }
  }
];

describe('<RequestResetPassword />', () => {
  let wrapper;
  it('should render and match the snapshot', () => {
    wrapper = mount(
      <MockedProvider>
        <RequestResetPassword />
      </MockedProvider>
    );

    const form = wrapper.find('form');
    expect(toJson(form)).toMatchSnapshot();
  });

  it('should call the mutation', async () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestResetPassword />
      </MockedProvider>
    );

    // Simulate typing an email
    wrapper.find('input').simulate('change', {
      target: { name: 'email', value: 'ptviet@live.com' }
    });

    // Submit the form
    wrapper.find('form').simulate('submit');
    await wait();
    wrapper.update();
    expect(wrapper.find('p').text()).toContain('Reset link emailed');
  });
});
