import UpdateItem from '../components/UpdateItem';
import PleaseSignin from '../components/PleaseSignin';

const Update = props => (
  <div>
    <PleaseSignin>
      <UpdateItem id={props.query.id} />
    </PleaseSignin>
  </div>
);

export default Update;
