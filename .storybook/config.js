import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/Live.js');
  require('../stories/Editor.js');
}

configure(loadStories, module);
