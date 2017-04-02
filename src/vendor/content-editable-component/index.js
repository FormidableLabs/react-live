import React, { Component, PropTypes } from "react";

import selectRange from "../selection-range";
import callIfDefinedAndHalt from "./callIfDefinedAndHalt";
import changeWorthyEvent_ from "./changeWorthyEvent";
import normalizeHTML from "./normalizeHTML";

import { htmlToPlain } from "./plainContent";
import { htmlToTags, addTagsToPlain } from "./tags";

import formatSelection from "./formatSelection";

const wrapSelection = o => ({
  ...o,
  selection: {
    start: o.selection.start === -1 ? o.plain.length : o.selection.start,
    end: o.selection.end === -1 ? o.plain.length : o.selection.end
  }
});

class RichText extends Component {
  constructor(props) {
    super(props);

    this.onRef = this.onRef.bind(this);
    this.onChange = this.onChange.bind(this);

    this.selectCB = this.selectCB.bind(this);
    this.changeWorthyEvent = (props.changeWorthyEvent || changeWorthyEvent_)
      .bind(this);

    this.state = wrapSelection({
      selection: props.selection || {
        start: 0,
        end: 0
      },
      html: props.html || addTagsToPlain(props.plain, props.tags || []) || "",
      plain: props.plain || htmlToPlain(props.html || ""),
      tags: props.tags || htmlToTags(props.html || "")
    });
  }

  static getSelection(element) {
    if (element.contains(window.getSelection().anchorNode)) {
      const selection = selectRange(element);

      if (RichText.selectionIsBackwards()) {
        selection.isBackwards = true;
      }

      return selection;
    } else {
      return null;
    }
  }

  static selectionIsBackwards() {
    const sel = getSelection();
    const position = sel.anchorNode.compareDocumentPosition(sel.focusNode);

    return (!position && sel.anchorOffset > sel.focusOffset) ||
      position === Node.DOCUMENT_POSITION_PRECEDING;
  }

  componentWillReceiveProps(props_) {
    const props = wrapSelection({
      selection: props_.selection || this.state.selection,
      html: props_.html ||
        addTagsToPlain(props_.plain, props_.tags || []) ||
        "",
      plain: props_.plain || htmlToPlain(props_.html || ""),
      tags: props_.tags || htmlToTags(props_.html || "")
    });

    this.setState({
      ...props
    });

    this.domThis.innerHTML = this.state.html;
  }

  componentDidMount() {
    this.domThis.innerHTML = this.state.html;

    if (this.props.focus) {
      this.domThis.focus();
    }

  }

  componentDidUpdate() {
    if (this.props.focus) {
      this.domThis.focus();

      if (this.state.plain.length > 0) {
        selectRange(this.domThis, this.state.selection);

        if (this.state.selection.isBackwards) {
          const anchorNode = window.getSelection().anchorNode;
          const anchorOffset = window.getSelection().anchorOffset;
          const focusNode = window.getSelection().focusNode;
          const focusOffset = window.getSelection().focusOffset;

          window.getSelection().collapse(focusNode, focusOffset);
          window.getSelection().extend(anchorNode, anchorOffset);
        }
      }
    }
  }

  onChange(e) {
    if (e) {
      this.selectCB(e);
    }

    const state = {
      selection: RichText.getSelection(this.domThis),
      html: normalizeHTML(this.domThis.innerHTML) || ""
    };

    state.plain = htmlToPlain(state.html);
    state.tags = htmlToTags(state.html);
    delete state.selection.atStart;

    this.props.onChangeCB(state, e);

    this.setState(state);
  }

  onRef(node) {
    this.domThis = node;
  }

  render() {
    return (
      <div
        ref={this.onRef}
        contentEditable
        className="editor-rich"
        onKeyUp={this.onChange}
        onClick={this.onChange}
        dangerouslySetInnerHTML={{ __html: this.state.html }}
        style={{
          whiteSpace: "pre-wrap",
          display: "inline-block"
        }}
      />
    );
  }

  selectCB(e) {
    switch (e.keyCode) {
      case 38:
        return callIfDefinedAndHalt(this.props.upKeyCB, e, this.state);

      case 40:
        return callIfDefinedAndHalt(this.props.downKeyCB, e, this.state);

      case 39:
        return callIfDefinedAndHalt(this.props.rightKeyCB, e, this.state);

      case 37:
        return callIfDefinedAndHalt(this.props.leftKeyCB, e, this.state);

      case 8:
        return callIfDefinedAndHalt(this.props.bkspKeyCB, e, this.state);

      case 46:
        return callIfDefinedAndHalt(this.props.deleteKeyCB, e, this.state);

      case 13:
        return callIfDefinedAndHalt(this.props.enterKeyCB, e, this.state);
    }
  }
}

/* eslint react/prop-types: 2 */

RichText.propTypes = {
  html: PropTypes.string,
  plain: PropTypes.string,
  tags: PropTypes.array,
  selection: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number
  }),
  focus: PropTypes.bool,

  changeWorthyEvent: PropTypes.func,
  onChangeCB: PropTypes.func,
  upKeyCB: PropTypes.func,
  downKeyCB: PropTypes.func,
  rightKeyCB: PropTypes.func,
  leftKeyCB: PropTypes.func,
  bkspKeyCB: PropTypes.func,
  deleteKeyCB: PropTypes.func,
  enterKeyCB: PropTypes.func
};

export default RichText;
