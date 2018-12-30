import { Query } from 'react-apollo';
import SignIn from './SignIn';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const PleaseSignin = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, error, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <ErrorMessage error={error} />;
      if (!data.me) {
        return (
          <div>
            <p>Please login first.</p>
            <SignIn />
          </div>
        );
      }
      return props.children;
    }}
  </Query>
);

export default PleaseSignin;
