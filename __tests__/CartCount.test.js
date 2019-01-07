import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import CartCount from '../components/CartCount';

describe('<CartCount />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<CartCount count={5} />);
  });

  it('should render', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should match the snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should update via props', () => {
    wrapper.setProps({ count: 11 });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
