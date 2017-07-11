import React, { Component } from 'react'
import cn from '../../utils/cn'
import prism from '../../utils/prism'
import getIndent from '../../utils/getIndent'
import normalizeCode from '../../utils/normalizeCode'
import normalizeHtml from '../../utils/normalizeHtml'
import htmlToPlain from '../../utils/htmlToPlain'
import selectionRange from '../../vendor/selection-range'

class Editor extends Component {
  static defaultProps = {
    contentEditable: true
  }

  undoStack = []
  undoOffset = 0
  undoTimestamp = 0

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
    this.setState({ html: prism(plain) })

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
      if(!this.tabGuarded){
        document.execCommand('insertHTML', false, '&#009')
        evt.preventDefault()
      }
    }else if (evt.keyCode && evt.keyCode === 27) {//Esc Key
      this.tabGuarded=true
      this.ref.classList.add("tabGuarded")
    }else if(!(evt.shiftKey || evt.ctrlKey || evt.altKey)){
      this.tabGuarded=false
      this.ref.classList.remove("tabGuarded")
    }

    if (evt.keyCode === 13) { // Enter Key
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
      this.updateContent(plain)
    } else {
      this.undoTimestamp = 0
    }
  }

  onClick = evt => {
    if (this.props.onClick) {
      this.props.onClick(evt)
    }
    this.undoTimestamp = 0 // Reset timestamp
    this.selection = selectionRange(this.ref)
  }

  onFocus = evt =>{
    if(this.tabGuarded && document.activeElement === this.ref){
      this.ref.classList.add("tabGuarded")
    }
    return evt
  }
  onBlur = evt => {
    this.tabGuarded =true
    this.ref.classList.remove("tabGuarded")
    return evt
  }

  componentWillMount() {
    const html = prism(normalizeCode(this.props.code))
    this.setState({ html })
    this.tabGuarded=true
  }

  componentDidMount() {
    this.recordChange(this.getPlain())
    this.undoTimestamp = 0 // Reset timestamp
  }

  componentWillReceiveProps({ code }) {
    if (code !== this.props.code) {
      const html = prism(normalizeCode(code))
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
    const { contentEditable, className, style, ...rest } = this.props
    const { html } = this.state
    delete rest.code

    return (
      <pre
        {...rest}
        ref={this.onRef}
        className={cn('prism-code', className)}
        style={style}
        contentEditable={contentEditable}
        onKeyDown={contentEditable && this.onKeyDown}
        onKeyUp={contentEditable && this.onKeyUp}
        onClick={contentEditable && this.onClick}
        onFocus={contentEditable && this.onFocus}
        onBlur={contentEditable && this.onBlur}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
}
export default Editor