import React, { Component } from 'react';
import CodeEditor from 'react-simple-code-editor';
import cn from '../../utils/cn'
import prism from '../../utils/prism';

class Editor extends Component {
  static defaultProps = {
    language: 'jsx',
  };

  state = {
    code: this.props.code,
  };

  _handleValueChange = code => {
    this.setState({ code });

    if (this.props.onChange) {
      this.props.onChange(code);
    }
  };

  render() {
    const {
      contentEditable,
      className,
      code,
      language,
      onChange,
      ...rest
    } = this.props

    return (
      <CodeEditor
        value={this.state.code}
        onValueChange={this._handleValueChange}
        className={cn('prism-code', className)}
        highlight={value => prism(value, language)}
        padding=".5rem"
        {...rest}
      />
    );
  }
}

export default Editor
