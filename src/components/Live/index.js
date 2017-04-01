import React, { Component } from 'react'
import Editor from '../Editor'
import Preview from './Preview'

class Live extends Component {
  state = {
    expandedCode: false,
    code: this.props.code
  }

  toggleExpanded = () => {
    this.setState({
      expandedCode: !this.state.expandedCode
    })
  }

  changeCode = code => {
    this.setState({ code })
  }

  render() {
    const {
      scope,
      className
    } = this.props

    const {
      expandedCode,
      code
    } = this.state

    return (
      <div className={`${className} playground collapsableCode`}>
        <div className={`playgroundCode${expandedCode ? ' expandedCode' : ''}`}>
          <Editor
            className="playgroundStage"
            code={code}
            onChange={this.changeCode}
          />
        </div>

        <div className="playgroundToggleCodeBar">
          <span className="playgroundToggleCodeLink" onClick={this.toggleExpanded}>
            {expandedCode ? 'hide source' : 'view source'}
          </span>
        </div>

        <div className="playgroundPreview">
          <Preview
            code={code}
            scope={scope}
          />
        </div>
      </div>
    );
  }
}

export default Playground
