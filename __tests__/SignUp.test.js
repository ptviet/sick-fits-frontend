import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloConsumer } from 'react-apollo';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import wait from 'waait';
import SignUp, { SIGNUP_MUTATION } from '../components/SignUp';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';

const type = (wrapper, name, value) => {
  const input = wrapper.find(`input[name="${name}"]`);
  input.simulate('change', { target: { name, value } });
};

const me = fakeUser();
const mocks = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        email: me.email,
        name: me.name,
        password: 'password'
      }
    },
    result: {
      data: {
        signup: {
          __typename: 'User',
          id: me.id,
          email: me.email,
          name: me.name
        }
      }
    }
  },
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me
      }
    }
  }
];

describe('<SignUp/>', () => {
  let wrapper;
  it('should render and match snapshot', async () => {
    wrapper = mount(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );
    expect(toJson(wrapper.find('form'))).toMatchSnapshot();
  });

  it('should call the mutation properly', async () => {
    let apolloClient;
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <SignUp />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    // Simulate input
    type(wrapper, 'email', me.email);
    type(wrapper, 'name', me.name);
    type(wrapper, 'password', 'password');

    wrapper.update();
    wrapper.find('form').simulate('submit');
    await wait();

    // Query the user
    const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(user.data.me).toMatchObject(me);
  });
});
