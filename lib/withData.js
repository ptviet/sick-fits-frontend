import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpointProd } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';

function createClient({ headers }) {
  return new ApolloClient({
    // uri: process.env.NODE_ENV === 'development' ? endpoint : endpointProd,
    uri: 'https://sp-sick-fits-yoga-prod.herokuapp.com',
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include'
        },
        headers
      });
    },
    // Local data
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, { cache }) {
            // Read the cartOpen value from the cache
            const { cartOpen } = cache.readQuery({ query: LOCAL_STATE_QUERY });
            // Write new cartOpen state
            const data = {
              data: {
                cartOpen: !cartOpen
              }
            };
            cache.writeData(data);
            return data;
          }
        }
      },
      defaults: {
        cartOpen: false
      }
    }
  });
}

export default withApollo(createClient);
