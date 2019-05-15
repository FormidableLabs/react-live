import React from 'react';
import styled from 'styled-components';
import * as polished from 'polished';

import { foreground, blue } from '../utils/colors';

const Image = styled.div`
  background-image: url(https://raw.githubusercontent.com/philpl/react-live/master/docs/logo.gif);
  background-size: cover;
  background-position: center;

  width: ${polished.rem(160)};
  height: ${polished.rem(160)};
  border-radius: ${polished.rem(3)};
`;

const SubTitle = styled.h2`
  font-size: ${polished.modularScale(1)};
  font-weight: bold;
  color: ${blue};
  margin: 0;
  margin-left: ${polished.rem(30)};
  letter-spacing: ${polished.rem(0.3)};
  line-height: 1.5;

  @media (max-width: 600px) {
    margin-left: 0;
    margin-top: ${polished.rem(30)};
  }
`;

const Title = styled.h1`
  font-weight: normal;
  font-size: ${polished.modularScale(4)};
  line-height: 1.1;
  margin: 0;
  margin-left: ${polished.rem(25)};

  @media (max-width: 600px) {
    margin-left: 0;
    margin-top: ${polished.rem(25)};
    margin-top: ${polished.rem(25)};
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  text-align: left;
  margin: ${polished.rem(30)} 0;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Description = styled.div`
  margin: ${polished.rem(80)};
  text-align: center;
  font-size: ${polished.modularScale(1)};
  color: ${blue};
  line-height: 1.5;

  @media (max-width: 600px) {
    margin: ${polished.rem(80)} 0;
  }
`;

const Button = styled.a`
  display: inline-block;
  width: auto;
  padding: ${polished.rem(10)} ${polished.rem(20)};
  text-decoration: none;
  border-radius: ${polished.rem(3)};
  background: ${blue};
  color: ${foreground};
  margin: ${polished.rem(30)} 0;
`;

const Container = styled.div`
  width: 100%;
  margin-bottom: ${polished.rem(60)};
`;

const Header = () => (
  <Container>
    <TitleRow>
      <Image />

      <div>
        <Title>React Live</Title>
        <SubTitle>
          A production-focused playground for live editing React code 📡
        </SubTitle>
      </div>
    </TitleRow>

    <Description>
      <div>
        Easily render live editable React components with server-side rendering
        support and a tiny bundle size, thanks to Bublé and a Prism.js-based
        editor.
      </div>

      <Button
        href="https://github.com/FormidableLabs/react-live"
        target="_blank"
        rel="noopener"
      >
        GitHub
      </Button>
    </Description>
  </Container>
);
export default Header;
