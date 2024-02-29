import React from "react";
import Layout from "@theme/Layout";

import responsiveFeature from "../../static/img/feature-1.png";
import nativeFeature from "../../static/img/feature-2.png";
import styleFeature from "../../static/img/feature-3.png";
import { LandingBanner } from "../components/landing/landing-banner";
import { LandingHero } from "../components/landing/landing-hero";
import { LandingFeaturedProjects } from "../components/landing/landing-featured-projects";
import { LandingFeatures } from "../components/landing/landing-features";
import { DemoLiveEditor } from "../components/live-edit";
import { LandingDivider } from "../components/landing/landing-divider";

export const jsxExample = `
<h3 style={{
  background: 'darkslateblue',
  color: 'white',
  padding: 8,
  borderRadius: 4
}}>
  Hello World! 👋
</h3>
`.trim();

export default function Index() {
  return (
    <Layout
      title="React Live"
      description="A flexible playground for live editing React components"
    >
      <div className="dark:bg-gray-500 bg-gray-200 dark:text-white text-theme-2">
        <LandingHero
          heading="React Live"
          body="A flexible playground for live editing React components"
          copyText="pnpm add react-live"
          navItems={[
            { link: "/open-source/react-live/docs", title: "Documentation" },
            { link: "#demo", title: "Demo" },
            {
              link: "https://github.com/FormidableLabs/react-live",
              title: "Github",
            },
          ]}
        />
      </div>
      <LandingFeatures
        heading="Features"
        list={[
          {
            imgSrc: responsiveFeature,
            alt: "logo alt",
            title: "Live Rendering",
            body: "React Live brings you the ability to render React components with editable source code and live preview",
          },
          {
            imgSrc: styleFeature,
            alt: "logo alt",
            title: "Customizable",
            body: "React Live is structured modularly and lets you style and compose its components freely",
          },
          {
            imgSrc: nativeFeature,
            alt: "logo alt",
            title: "Lightweight Bundle",
            body: "Lightweight and performant, React Live is built with minimal dependencies and optimized for speed",
          },
        ]}
      />
      <div
        className="flex flex-col text-left mx-16 lg:mx-32 xl:mx-64"
        id="demo"
      >
        <LandingDivider />
        <h2 className="my-8 text-4xl font-semibold">Demo</h2>
        <p>Edit the code for live updates!</p>
        <DemoLiveEditor code={jsxExample} />
      </div>
      <LandingFeaturedProjects
        heading="More Open Source from Nearform Commerce"
        showDivider
        projects={[
          {
            name: "spectacle",
            link: "https://commerce.nearform.com/open-source/spectacle",
            description:
              "A React.js based library for creating sleek presentations using JSX syntax with the ability to live demo your code!",
          },
          {
            name: "figlog",
            link: "https://github.com/FormidableLabs/FigLog",
            description:
              "FigLog is the easiest and most efficient way to document team decisions and the evolution of your changes in Figma.",
            title: "FigLog",
          },
          {
            name: "envy",
            link: "https://github.com/FormidableLabs/envy",
            description:
              "Envy will trace the network calls from every application in your stack and allow you to view them in a central place.",
          },
          {
            name: "victory",
            link: "https://commerce.nearform.com/open-source/victory/",
            description:
              "React.js components for modular charting and data visualization.",
          },
        ]}
      />
    </Layout>
  );
}
