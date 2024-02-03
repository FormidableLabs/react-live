import { generateElement } from "../../transpile";
import { shallow } from "../renderer";

describe("transpile", () => {
  it("should support optional chain", () => {
    const code = `function Demo() {
        return <h3 style={{
            background: 'darkslateblue',
            color: 'white',
            padding: 8,
            borderRadius: 4
        }}>
            {'1'?.toString()}
        </h3>
        }`;
    const Component = generateElement({ code });
    const wrapper = shallow(<Component />);

    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<h3 style=\\"background:darkslateblue;color:white;padding:8px;border-radius:4px\\">1</h3>"`
    );
  });
});
