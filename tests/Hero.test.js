import { shallow } from "enzyme";
import Hero from "../components/Hero.jsx";

let wrapper;

const block = {
  title: 'Test title',
  body: 'Test body',
  image: 'https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png'
};

beforeEach(() => {
  wrapper = shallow( <Hero block={block} />);
});

describe("Hero block", () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});