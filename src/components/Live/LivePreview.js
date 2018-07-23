import React, { Component } from 'react'
import { LiveContextTypes } from './LiveProvider'
import cn from '../../utils/cn'

class LivePreview extends Component {
  static defaultProps = {
    renderElement: Element => Element && <Element />
  }

  render() {
    const { className, live: element, renderElement, ...rest } = this.props;

    const Element = element;

    return (
      <div
        {...rest}
        className={cn('react-live-preview', className)}
      >
        {this.props.renderElement(Element)}
      </div>
    );
  }
}

LivePreview.contextTypes = LiveContextTypes

export default LivePreview
