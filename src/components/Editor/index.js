import React, { Component } from 'react'
import ContentEditable from './ContentEditable'
import Style from './Style'
import unescape from 'unescape'

import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'

const markup = code => highlight(code, languages.jsx)

class Editor extends Component {
  static defaultProps = {
    code: ''
  }

  state = { html: '' }

  onChange = ({ plain, selection }, evt) => {
    const code = unescape(plain)
    const html = markup(code)
    this.setState({ html, selection })

    if (this.props.onChange) {
      this.props.onChange(code)
    }
  }

  componentWillMount() {
    const html = markup(this.props.code)
    this.setState({ html })
  }

  render() {
    const { html, selection } = this.state

    return (
      <div>
        <ContentEditable
          focus
          html={html}
          onChangeCB={this.onChange}
          enterKeyCB={this.onEnter}
          selection={selection}
        />

        <Style />
      </div>
    )
  }
}

export default Editor
