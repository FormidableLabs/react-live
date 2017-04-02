import React from 'react'
import styled from 'styled-components'

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
  height: 100%;
  box-shadow: 1px 1px 20px rgba(20, 20, 20, 0.27);
`

const StyledEditor = styled(LiveEditor)`
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;

  flex-basis: 50%;
  width: 50%;
  max-width: 50%;
  overflow: scroll;
`

const StyledPreview = styled(LivePreview)`
  position: relative;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  border: 1px solid #1D1F21;
  padding: 0.5rem;

  flex-basis: 50%;
  width: 50%;
  max-width: 50%;
  overflow: hidden;
`

const StyledError = styled(LiveError)`
  position: absolute;
  display: block;
  bottom: 10px;
  left: 10px;
  right: 10px;
  padding: 8px;
  border-radius: 3px;
  background: red;
  color: white;
`

const initialCode = (`
<center>
	<h2>React Live</h2>
	<img src="https://raw.githubusercontent.com/philpl/react-live/master/docs/logo.gif" width="250" />
</center>
`).trim()

const LiveEdit = () => (
  <StyledProvider code={initialCode}>
    <StyledEditor />
    <StyledPreview />
    <StyledError />
  </StyledProvider>
)

export default LiveEdit
