import React from 'react';

export default class GatedComponent extends React.Component {
  componentDidMount() {
    this.focusTarget = document.getElementById(this.props.idToFocus) || findFirstFocusableChild(this.ref) || this.ref;
    //Make all child elements untabbable
    removeChildTabIndexes(this.ref);

    this.ref.addEventListener(
      'keydown',
      createEnterHandler(this.focusTarget),
    );
    
    this.ref.addEventListener('keydown', handleEscape, true);
  }

  render() {
    return (
      <div ref={element => (this.ref = element)} tabIndex="0">
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

function findFirstFocusableChild(elem){
  var allChildren = Array.from(elem.getElementsByTagName('*'));
  var tabbableChild = undefined;
  
  for(let i = 0; i < allChildren.length && !tabbableChild; i++){
    if(allChildren[i].tabIndex>=0){
      tabbableChild = allChildren[i];
    }
  }
  return tabbableChild;
}

function createEnterHandler(focusTarget) {    
  return function handleEnter(event) {
    if (
      event.keyCode &&
      event.keyCode === 13 &&
      document.activeElement === this
    ) {
      event.preventDefault();
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

// <code-editor aria-describedby="code-description"></code>
// <div id="code-description" class="sr-only">This is a code editor in which its showcased how Glamorous works. In order to exit press the escape key.</div>
