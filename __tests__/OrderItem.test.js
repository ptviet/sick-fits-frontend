import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import OrderItem from '../components/OrderItem';
import { fakeOrderItem } from '../lib/testUtils';

const item = fakeOrderItem();

describe('<OrderItem />', () => {
  it('should render and match snapshot', () => {
    const wrapper = shallow(<OrderItem item={item} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
