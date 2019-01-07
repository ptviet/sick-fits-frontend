import Link from 'next/link';
import { Mutation } from 'react-apollo';
import NavStyles from './styles/NavStyles';
import User from './User';
import SignOut from './SignOut';
import CartCount from './CartCount';
import { TOGGLE_CART_MUTATION } from './Cart';

const Nav = () => (
  <User>
    {({ data: { me } }) => {
      let matchedPermissions;
      if (me) {
        matchedPermissions = me.permissions.filter(myPermission =>
          ['PERMISSIONUPDATE', 'ADMIN'].includes(myPermission)
        );
      }

      return (
        <NavStyles>
          <Link href="/items">
            <a>Shop</a>
          </Link>
          {me && (
            <>
              <Link href="/sell">
                <a>Sell</a>
              </Link>
              <Link href="/orders">
                <a>Orders</a>
              </Link>
              {matchedPermissions.length && (
                <Link href="/permission">
                  <a>Permissions</a>
                </Link>
              )}
              <Link href="/me">
                <a>Account</a>
              </Link>
              <Mutation mutation={TOGGLE_CART_MUTATION}>
                {toggleCart => (
                  <button onClick={toggleCart}>
                    My Cart
                    <CartCount
                      count={me.cart.reduce(
                        (total, cartItem) => total + cartItem.quantity,
                        0
                      )}
                    />
                  </button>
                )}
              </Mutation>
              <SignOut />
            </>
          )}
          {!me && (
            <Link href="/signup">
              <a>Sign Up - Sign In</a>
            </Link>
          )}
        </NavStyles>
      );
    }}
  </User>
);

export default Nav;
