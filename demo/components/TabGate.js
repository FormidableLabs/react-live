import React from 'react';

var accessibilityMessage=`Press 'Enter' to edit code, and 'Esc' when finished.`;
var offscreen = {
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  width: '1px'
 }

export default class TabGate extends React.Component {
  componentDidMount() {
    hide(this.navTip);
    
    if(!this.focusTarget){
      this.focusTarget = 
        document.getElementById(this.props.idToFocus) || 
        findFirstFocusableChild(this.ref) || 
        this.ref;
    }
    
    //Make all child elements untabbable
    removeChildTabIndexes(this.ref);
    
    this.ref.addEventListener('keydown', createEnterHandler(this.focusTarget));
    this.ref.addEventListener('keydown', handleEscape, true);
    this.ref.addEventListener('focus',(event)=>show(this.navTip));
    this.ref.addEventListener('blur',(event)=>hide(this.navTip));
  }

  render() {
    return (
      <div ref={element => (this.ref = element)} tabIndex="0">
        <span style={offscreen} hidden='true' ref={element => (this.navTip = element)} role="alert">{accessibilityMessage}</span>
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
  console.log(focusTarget);
  return function handleEnter(event) {
    if (
      event.keyCode &&
      event.keyCode === 13 &&
      document.activeElement === this
    ) {
      console.log(focusTarget);
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

function show(element){
  element.hidden=false;
  element.setAttribute('aria-hidden',false);
}

function hide(element){
  element.hidden=true;
  element.setAttribute('aria-hidden',true);
}
