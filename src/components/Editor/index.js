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

  updateHighlighting = () => {
    const plain = this.getPlain()

    this.setState({ html: prism(plain) })

    if (this.props.onChange) {
      this.props.onChange(plain)
    }
  }

  onKeyDown = evt => {
    // NOTE: This prevents bad default behaviour
    if (evt.keyCode === 9) { // Tab Key
      document.execCommand('insertHTML', false, '&#009')
      evt.preventDefault()
    } else if (evt.keyCode === 13) { // Enter Key
      const { start: cursorPos } = selectionRange(this.ref)
      const indentation = getIndent(this.getPlain(), cursorPos)

      document.execCommand('insertHTML', false, '\n' + indentation)
      evt.preventDefault()
    }
  }

  onKeyUp = evt => {
    this.selection = selectionRange(this.ref)
    this.updateHighlighting()
  }

  onClick = () => {
    this.selection = selectionRange(this.ref)
  }

  componentWillMount() {
    const html = prism(normalizeCode(this.props.code))
    this.setState({ html })
  }

  componentWillReceiveProps({ code }) {
    if (code !== this.props.code) {
      const html = prism(normalizeCode(this.props.code))
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
    const { contentEditable, className, style } = this.props
    const { html } = this.state

    return (
      <pre
        ref={this.onRef}
        className={cn('prism-code', className)}
        style={style}
        contentEditable={contentEditable}
        onKeyDown={contentEditable && this.onKeyDown}
        onKeyUp={contentEditable && this.onKeyUp}
        onClick={contentEditable && this.onClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
}

export default Editor
