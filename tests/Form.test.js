import { shallow } from "enzyme";
import Form from "../components/Form.jsx";

let wrapper;

const block = {
  title: 'Test title',
  body: 'abc123airtableformcode'
};

beforeEach(() => {
  wrapper = shallow( <Form block={block} />);
});

describe("Form block", () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});