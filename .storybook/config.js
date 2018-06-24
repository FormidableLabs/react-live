import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/Live.js');
}

configure(loadStories, module);
