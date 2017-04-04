import React from 'react'
import styled, { css } from 'styled-components'
import * as polished from 'polished'
import { foreground, red, lightGrey } from '../utils/colors'

import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live'

const StyledProvider = styled(LiveProvider)`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: stretch;
  border-radius: ${polished.rem(3)};
  box-shadow: 1px 1px 20px rgba(20, 20, 20, 0.27);
  overflow: hidden;
  margin-bottom: ${polished.rem(100)};

  @media (max-width: 600px) {
    flex-direction: column;
  }
`

const column = css`
  flex-basis: 50%;
  width: 50%;
  max-width: 50%;

  @media (max-width: 600px) {
    flex-basis: auto;
    width: 100%;
    max-width: 100%;
  }
`

const StyledEditor = styled(LiveEditor)`
  background: ${lightGrey};
  font-family: 'Source Code Pro', monospace;
  font-size: ${polished.rem(14)};
  height: ${polished.rem(350)};
  overflow: scroll;

  ${column}
`

const StyledPreview = styled(LivePreview)`
  position: relative;
  padding: 0.5rem;
  background: white;
  color: black;
  height: auto;
  overflow: hidden;

  ${column}
`

const StyledError = styled(LiveError)`
  position: absolute;
  display: block;
  bottom: ${polished.rem(10)};
  left: ${polished.rem(10)};
  right: ${polished.rem(10)};
  padding: ${polished.rem(8)};
  border-radius: ${polished.rem(3)};
  background: ${red};
  color: ${foreground};
  box-shadow: 1px 1px 20px rgba(20, 20, 20, 0.27);
`

const LiveEdit = ({ code }) => (
  <StyledProvider
    code={code}
    mountStylesheet={false}
  >
    <StyledEditor />
    <StyledPreview />
    <StyledError />
  </StyledProvider>
)

export default LiveEdit
