import React from 'react'
import ContentEditable from 'content-editable-component'

ContentEditable.prototype.render = function render() {
  const { className, style } = this.props

  return (
    <pre
      className={`prism-code ${className || ''}`}
      style={style}
      contentEditable
      onKeyDown={evt => {
        // NOTE: This prevents bad default behaviour
        if (evt.keyCode === 9) {
          document.execCommand('insertHTML', false, '&#009')
          evt.preventDefault()
        }
      }}
      onKeyUp={this.onChange}
      onClick={this.onChange}
      dangerouslySetInnerHTML={{ __html: this.state.html }}
    />
  );
}

export default ContentEditable
