import { shallow } from "enzyme";
import Photo from "../components/Photo.jsx";

let wrapper;

const block = {
  title: 'Test title',
  body_markdown: 'Test body',
  image: 'https://cdn2-www.dogtime.com/assets/uploads/2011/03/puppy-development.jpg',
  alt: 'golden retriever puppy'
};

beforeEach(() => {
  wrapper = shallow( <Photo block={block} />);
});

describe("Photo block", () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});