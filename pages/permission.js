import PleaseSignin from '../components/PleaseSignin';
import Permission from '../components/Permission';

const PermissionPage = props => (
  <div>
    <PleaseSignin>
      <Permission />
    </PleaseSignin>
  </div>
);

export default PermissionPage;
