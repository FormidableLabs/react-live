import React, { Component } from 'react'
import cn from '../../utils/cn'
import prism from '../../utils/prism'
import normalizeHtml from '../../utils/normalizeHtml'
import htmlToPlain from '../../utils/htmlToPlain'
import selectionRange from '../../vendor/selection-range'

class Editor extends Component {
  state = {
    html: ''
  }

  onRef = node => {
    this.ref = node
  }

  updateHighlighting = keyCode => {
    const html = normalizeHtml(this.ref.innerHTML)
    const plain = htmlToPlain(html)

    this.setState({ html: prism(plain) })

    if (this.props.onChange) {
      this.props.onChange(plain)
    }
  }

  onKeyDown = evt => {
    // NOTE: This prevents bad default behaviour
    if (evt.keyCode === 9) {
      document.execCommand('insertHTML', false, '&#009')
      evt.preventDefault()
    } else if (evt.keyCode === 13) {
      document.execCommand('insertHTML', false, '\n')
      evt.preventDefault()
    }
  }

  onKeyUp = evt => {
    this.selection = selectionRange(this.ref)
    this.updateHighlighting(evt.keyCode)
  }

  onClick = () => {
    this.selection = selectionRange(this.ref)
  }

  componentWillMount() {
    const html = prism(this.props.code)
    this.setState({ html })
  }

  componentWillReceiveProps({ code }) {
    if (code !== this.props.code) {
      const html = prism(this.props.code)
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
    const { className, style } = this.props
    const { html } = this.state

    return (
      <pre
        ref={this.onRef}
        className={cn('prism-code', className)}
        style={style}
        contentEditable
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onClick={this.onClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
}

export default Editor
