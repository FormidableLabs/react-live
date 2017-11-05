import React, { Component } from 'react'
import cn from '../../utils/cn'
import prism from '../../utils/prism'
import normalizeCode from '../../utils/normalizeCode'
import normalizeHtml from '../../utils/normalizeHtml'
import htmlToPlain from '../../utils/htmlToPlain'
import selectionRange from '../../vendor/selection-range'
import { getIndent, getDeindentLevel } from '../../utils/getIndent'

class Editor extends Component {
  static defaultProps = {
    contentEditable: true,
    language: 'jsx'
  }

  undoStack = []
  undoOffset = 0
  undoTimestamp = 0
  compositing = false

  state = {
    html: ''
  }

  onRef = node => {
    this.ref = node
  }

  getPlain = () => {
    if (this._innerHTML === this.ref.innerHTML) {
      return this._plain
    }

    const plain = htmlToPlain(normalizeHtml(this.ref.innerHTML))

    this._plain = plain
    this._innerHTML = this.ref.innerHTML

    return this._plain
  }

  recordChange = (plain, selection) => {
    if (plain === this.undoStack[this.undoStack.length - 1]) {
      return
    }

    if (this.undoOffset > 0) {
      this.undoStack = this.undoStack.slice(0, -this.undoOffset)
      this.undoOffset = 0
    }

    const timestamp = Date.now()
    const record = { plain, selection }

    // Overwrite last record if threshold is not crossed
    if (timestamp - this.undoTimestamp < 3000) {
      this.undoStack[this.undoStack.length - 1] = record
    } else {
      this.undoStack.push(record)

      if (this.undoStack.length > 50) {
        this.undoStack.shift()
      }
    }

    this.undoTimestamp = timestamp
  }

  updateContent = plain => {
    if (this.compositing) {
      return;
    }
    this.setState({ html: prism(plain, this.props.language) })

    if (this.props.onChange) {
      this.props.onChange(plain)
    }
  }

  restoreStackState = offset => {
    const { plain, selection } = this.undoStack[this.undoStack.length - 1 - offset]

    this.selection = selection
    this.undoOffset = offset
    this.updateContent(plain)
  }

  undo = () => {
    const offset = this.undoOffset + 1
    if (offset >= this.undoStack.length) {
      return
    }

    this.restoreStackState(offset)
  }

  redo = () => {
    const offset = this.undoOffset - 1
    if (offset < 0) {
      return
    }

    this.restoreStackState(offset)
  }

  onKeyDown = evt => {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(evt)
    }

    if (evt.keyCode === 9 && !this.props.ignoreTabKey) { // Tab Key
      document.execCommand('insertHTML', false, '  ')
      evt.preventDefault()
    } else if (evt.keyCode === 8) { // Backspace Key
      const { start: cursorPos, end: cursorEndPos } = selectionRange(this.ref)
      if (cursorPos !== cursorEndPos) {
        return // Bail on selections
      }

      const deindent = getDeindentLevel(this.getPlain(), cursorPos)
      if (deindent <= 0) {
        return // Bail when deindent level defaults to 0
      }

      // Delete chars `deindent` times
      for (let i = 0; i < deindent; i++) {
        document.execCommand('delete', false)
      }

      evt.preventDefault()
    } else if (evt.keyCode === 13) { // Enter Key
      const { start: cursorPos } = selectionRange(this.ref)
      const indentation = getIndent(this.getPlain(), cursorPos)
      document.execCommand('insertHTML', false, '\n' + indentation)
      evt.preventDefault()
    } else if (
      // Undo / Redo
      evt.keyCode === 90 &&
      evt.metaKey !== evt.ctrlKey &&
      !evt.altKey
    ) {
      if (evt.shiftKey) {
        this.redo()
      } else {
        this.undo()
      }

      evt.preventDefault()
    }
  }

  onKeyUp = evt => {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(evt)
    }
    if (
      evt.keyCode === 91 || // left cmd
      evt.keyCode === 93 || // right cmd
      evt.ctrlKey ||
      evt.metaKey
    ) {
      return
    }

    // Enter key
    if (evt.keyCode === 13) {
      this.undoTimestamp = 0
    }

    this.selection = selectionRange(this.ref)

    if (
      evt.keyCode !== 37 && // left
      evt.keyCode !== 38 && // up
      evt.keyCode !== 39 && // right
      evt.keyCode !== 40 // down
    ) {
      const plain = this.getPlain()

      this.recordChange(plain, this.selection)
      this.updateContent(plain);
    } else {
      this.undoTimestamp = 0
    }
  }

  onCompositionStart = evt => {
    if (this.props.onCompositionStart) {
      this.props.onCompositionStart(evt)
    }
    this.compositing = true;
  }

  onCompositionEnd = evt => {
    if (this.props.onCompositionEnd) {
      this.props.onCompositionEnd(evt)
    }
    this.compositing = false;
  }

  onClick = evt => {
    if (this.props.onClick) {
      this.props.onClick(evt)
    }
    this.undoTimestamp = 0 // Reset timestamp
    this.selection = selectionRange(this.ref)
  }

  componentWillMount() {
    const html = prism(normalizeCode(this.props.code), this.props.language)
    this.setState({ html })
  }

  componentDidMount() {
    this.recordChange(this.getPlain())
    this.undoTimestamp = 0 // Reset timestamp
  }

  componentWillReceiveProps({ code, language }) {
    if (code !== this.props.code || language !== this.props.language) {
      const html = prism(normalizeCode(code), language)
      this.setState({ html })
    }
  }

  componentDidUpdate() {
    const { selection } = this
    if (selection) {
      selectionRange(this.ref, selection)
    }
  }

  render() {
    const {
      contentEditable,
      className,
      style,
      code, // ignored & unused
      ignoreTabKey, // ignored & unused
      language, // ignored & unused
      ...rest
    } = this.props
    const { html } = this.state

    return (
      <pre
        {...rest}
        ref={this.onRef}
        className={cn('prism-code', className)}
        style={style}
        spellCheck="false"
        contentEditable={contentEditable}
        onCompositionEnd={contentEditable ? this.onCompositionEnd : undefined}
        onCompositionStart={contentEditable ? this.onCompositionStart : undefined}
        onKeyDown={contentEditable ? this.onKeyDown : undefined}
        onKeyUp={contentEditable ? this.onKeyUp : undefined}
        onClick={contentEditable ? this.onClick : undefined}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
}

export default Editor
