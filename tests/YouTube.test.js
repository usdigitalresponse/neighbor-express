import { shallow } from "enzyme";
import YouTube from "../components/YouTube.jsx";

let wrapper;

const block = {
  title: 'Test title',
  body_markdown: 'Test body',
  href: 'https://youtu.be/NzwSF9GEm0E'
};

beforeEach(() => {
  wrapper = shallow( <YouTube block={block} />);
});

describe("YouTube block", () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});