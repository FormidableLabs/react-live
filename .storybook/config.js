import { configure } from '@kadira/storybook';

function loadStories() {
  // require('../src/components/Editor/index.stories.js');
  require('../src/components/Playground/index.stories.js');
}

configure(loadStories, module);
