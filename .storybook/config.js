import { configure } from '@kadira/storybook';

function loadStories() {
  require('../stories/Live.js');
  require('../stories/Editor.js');
}

configure(loadStories, module);
