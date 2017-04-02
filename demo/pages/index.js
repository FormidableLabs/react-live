import React, { Component } from 'react'
import styled from 'styled-components'

import LiveEdit from '../components/LiveEdit'

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
`

class Index extends Component {
  render() {
    return (
      <Container>
        <LiveEdit />
      </Container>
    )
  }
}

export default Index
