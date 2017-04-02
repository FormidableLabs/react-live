# Content Editable Component

## Forword

This component is still under heavy development, and no guarantee is given as to its performance or usefulness at this stage.

If you have any feedback/requests/bugs, please open an issue [here](https://bitbucket.org/codogo/content-editable-component/issues?status=new&status=open), and/or email us at [codes@codogo.io](codes@codogo.io)

## Overview

This is an component used for accessing and normalising a content editable component, as well as accessing the selection state of the content editable.

It aims to de-obfuscate working with content editable, by simplifying (not changing) your interaction with native DOM.

It is not [draft-js](https://facebook.github.io/draft-js/) (though we do like draft-js).

## TODO

+ Tests
+ Firefox
+ Safari
+ IE/Edge/Whatever who cares

## API

``` js
// variable props:

// Either set (html), or (plain & tags), not both!
	html: React.PropTypes.string,
	plain: React.PropTypes.string,
	tags: React.PropTypes.array,

	selection: React.PropTypes.shape({
		start: React.PropTypes.number,
		end: React.PropTypes.number,
	}),
	focus: React.PropTypes.bool,

// function props:
	changeWorthyEvent: ( ReactEvent ) => Boolean, // returns true if the given event should trigger `onChangeCB` (default is used if not provided)
	onChangeCB: ( { //called when a change-worthy event occurs, use this to fire an event to your store.
		content: "html of <b> content editable </b>",
		selection: {
			start: Number,
			end: Number,
		},
	}) => null,
	upKeyCB: ( { //called when the up arrow key is pressed, return true to prevent even propagation, return false to allow even propagation
		content: {
			html: "foo <b>bar</b> qux",
			plain: "foo bar qux"
		},
		selection: {
			start: Number,
			end: Number,
		},
	}) => true,
	downKeyCB: // same as upKeyCB, but for downKey
	rightKeyCB: // same as upKeyCB, but for rightKey
	leftKeyCB: // same as upKeyCB, but for leftKey
	bkspKeyCB: // same as upKeyCB, but for bkspKey
	deleteKeyCB: // same as upKeyCB, but for deleteKey
	enterKeyCB: // same as upKeyCB, but for enterKey
};

```

## Example

``` jsx

<RichText
   plain = "foo bar"
   tags = {[
      {
        type: "b",
        index: 4,
     },
      {
        type: "/b",
        index: 6,
     },
  ]}

   selection = { start: 1, end: 2 } } 
   upKeyCB = { (state) => {
      if(state.selection.start === state.selection.end
         && state.selection.start === 0){
            store.dispatch(moveFocusAC(props.id, -1));

            return true;
         }
      else{
         return false;
      }
   }}
   downKeyCB = { (state) => {
      if(state.selection.start === state.selection.end
         && state.selection.start === state.content.plain.length){
            store.dispatch(moveFocusAC(props.id, +1));

            return true;
         }
      else{
         return false;
      }
   }}
   bkspKeyCB = { (state) => {
      if(state.selection.start === state.selection.end
         && state.selection.start === 0){
            store.dispatch(mergeAC(props.id, -1));

            return true;
         }
      else{
         return false;
      }
   }}
   deleteKeyCB = { (state) => {
      if(state.selection.start === state.selection.end
         && state.selection.start === state.content.plain.length){
            store.dispatch(mergeAC(props.id, +1));

            return true;
         }
      else{
         return false;
      }
   }}
   onChangeCB = { (state) => {
      store.dispatch({
         type: Consts.Actions.User.Module.Set.CONTENT,
         id: props.id,
         newContent: state.content,
         newSelection: state.selection,
      });
   }}
/>

```

## Author

Written by [Codogo](https://codogo.io) for use in [Write](https://write.codogo.io)
