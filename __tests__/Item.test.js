import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Item from '../components/Item';
import { fakeItem } from '../lib/testUtils';

describe('<Item />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Item item={fakeItem()} />);
  });

  it('should render', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should match the snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should display properly', () => {
    expect(wrapper.find('Title a').text()).toBe(fakeItem().title);

    expect(wrapper.find('img').props().src).toBe(fakeItem().image);
    expect(wrapper.find('img').props().alt).toBe(fakeItem().title);

    const PriceTag = wrapper.find('PriceTag');
    expect(PriceTag.children().text()).toBe('$50');

    expect(wrapper.find('p').text()).toBe(fakeItem().description);

    expect(wrapper.find('.buttonList').children()).toHaveLength(3);
    expect(wrapper.find('.buttonList').find('Link')).toHaveLength(1);
    expect(
      wrapper
        .find('.buttonList')
        .find('Link a')
        .text()
    ).toBe('Edit ✏️');

    expect(wrapper.find('AddToCart')).toHaveLength(1);
    expect(wrapper.find('DeleteItem')).toHaveLength(1);
  });
});
