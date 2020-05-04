import { shallow } from "enzyme";
import Text from "../components/Text.jsx";

describe("Text block", () => {
	const block = {
		title: 'aaa',
		body_markdown: 'bbb',
	}
	it('shows header', () => {
    const text = shallow(<Text block={block} />);

    expect(text.find("h2").text()).toEqual("aaa");
  });

  it('shows body', () => {
    const text = shallow(<Text block={block} />);
    expect(text.contains(<div>bbb</div>)).toEqual(true);
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