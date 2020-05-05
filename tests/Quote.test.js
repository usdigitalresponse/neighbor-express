import { shallow } from "enzyme";
import Quote from "../components/Quote.jsx";

let wrapper;

const block = {
  title: 'May the Force be with you',
  body: 'Btn text',
  href: 'www.google.com'
};

beforeEach(() => {
  wrapper = shallow( <Quote block={block} />);
});

describe("Quote block", () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});