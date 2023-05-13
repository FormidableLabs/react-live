import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";

const code = `
function handleClick() {
  console.log("Hi there!");
}
const HelloWorld = () => (
  <button onClick={handleClick}>
    Hello World
  </button>
);
render(<HelloWorld />);
`.trim();

export const DemoApp = () => {
  return (
    <div>
      <LiveProvider code={code} noInline>
        <div className="grid lg:grid-cols-2 gap-4">
          <LiveEditor className="font-mono" />
          <LivePreview />
        </div>
        <LiveError className="text-red-800 bg-red-100 mt-2" />
      </LiveProvider>
    </div>
  );
};
