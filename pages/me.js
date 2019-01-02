import MyAccount from '../components/MyAccount';
import PleaseSignin from '../components/PleaseSignin';

const Me = props => (
  <div>
    <PleaseSignin>
      <MyAccount />
    </PleaseSignin>
  </div>
);

export default Me;
