import { shallow } from "enzyme";
import Text from "../components/Text.jsx";

let wrapper;

const block = {
  title: 'aaa',
  body_markdown: 'bbb',
};

beforeEach(() => {
  wrapper = shallow(<Text block={block} />);
});

describe("Text block", () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

	it('shows header', () => {
    expect(wrapper.find("h2").text()).toEqual("aaa");
  });

  it('shows body', () => {
    expect(wrapper.contains(<div>bbb</div>)).toEqual(true);
  });

  it('shows image', () => {
  	const block_with_image = {
  		...block,
  		image: 'exampleurl.com',
  		alt: 'test alt text'
  	}
    const text = shallow(<Text block={block_with_image} />);
    expect(text.contains(<img src='exampleurl.com' alt='test alt text'/>)).toEqual(true);
  });
});