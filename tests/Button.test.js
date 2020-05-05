import { shallow } from "enzyme";
import Button from "../components/Button.jsx";

let wrapper;

beforeEach(() => {
  wrapper = shallow(
    <Button href='/volunteer'>
      Volunteer now!!
    </Button>
  );
});

describe("Button component", () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});