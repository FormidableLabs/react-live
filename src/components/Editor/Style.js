import React from 'react'
import prismDarkCSS from '../../constants/prism.dark.css'

const prismStyling = <style dangerouslySetInnerHTML={{ __html: `
  .prism-code {
    font-family: monospace;
    font-size: inherit;

    display: block;
    white-space: pre;
    background-color: #1D1F21;
    color: #C5C8C6;
    padding: 0.5rem;
    border-radius: 3px;
    position: relative;

    margin: 0;
    box-sizing: border-box;
    vertical-align: baseline;
    outline: none;
    text-shadow: none;
    -webkit-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
    word-wrap: normal;
    word-break: normal;
    text-align: left;
    word-spacing: normal;
    -moz-tab-size: 2;
    -o-tab-size: 2;
    tab-size: 2;
  }

  ${prismDarkCSS}
`}} />

export default () => prismStyling


