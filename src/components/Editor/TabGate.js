import React from 'react';

var accessibilityMessage = `Press any key to edit code, press 'Esc' when finished.`;
var offscreen = {
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  width: '1px',
};

export default class TabGate extends React.Component {
  componentDidMount() {
    hide(this.navTip);

    if (!this.focusTarget) {
      this.focusTarget =
        document.getElementById(this.props.idToFocus) ||
        findFirstPre(this.ref) ||
        this.ref;
    }

    //Make all child elements untabbable
    removeChildTabIndexes(this.ref);
    
    var enterHandler = createEnterHandler(this.focusTarget);
    
    this.ref.addEventListener('keydown', enterHandler);
    this.ref.addEventListener('keydown', handleEscape, true);
    this.ref.addEventListener('focus', event => {
      addTabGuard(event.target);
    });
    this.ref.addEventListener('blur', event => {
      removeRemoveTabGuard(event.target);
    });
  }

  render() {
    return (
      <div ref={element => (this.ref = element)} tabIndex="0">
        <span
          style={offscreen}
          hidden="true"
          ref={element => (this.navTip = element)}
          role="alert"
        >
          {accessibilityMessage}
        </span>
        {this.props.children}
      </div>
    );
  }
}

function removeChildTabIndexes(elem) {
  Array.from(elem.getElementsByTagName('*')).forEach(child => {
    child.tabIndex = -1;
  });
}

function findFirstPre(elem) {
  return elem.getElementsByTagName('pre')[0];
}

function createEnterHandler(focusTarget) {
  return function handleEnter(event) {
    if (
      event.keyCode &&
      event.keyCode !== 9 &&
      event.keyCode !== 16 &&
      document.activeElement === this
    ) {
       focusTarget.focus();
    }
  };
}

function handleEscape(event) {
  if (event.keyCode && event.keyCode === 27) {
    this.focus();
    event.preventDefault();
    event.stopPropagation();
  }
}

function show(element) {
  element.hidden = false;
  element.setAttribute('aria-hidden', false);
}

function hide(element) {
  element.hidden = true;
  element.setAttribute('aria-hidden', true);
}

function addTabGuard(element) {
  show(this.navTip);
  element.classList.add('tab-guarded');
}

function removeTabGuard(element) {
  hide(this.navTip);
  element.classList.remove('tab-guarded');
}
