import React, { Component } from 'react'
import ContentEditable from './ContentEditable'
import Style from './Style'
import cn from '../../utils/cn'
import prism from '../../utils/prism'
import unescape from 'unescape'

class Editor extends Component {
  static defaultProps = {
    code: '',
    focus: true
  }

  state = { html: '' }

  onChange = ({ plain, selection }, evt) => {
    const code = unescape(plain)
    const html = prism(code)
    this.setState({ html, selection })

    if (this.props.onChange) {
      this.props.onChange(code)
    }
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

  render() {
    const { className, style, focus } = this.props
    const { html, selection } = this.state

    return (
      <div>
        <ContentEditable
          className={cn('react-live-editor', className)}
          style={style}
          focus={focus}
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
