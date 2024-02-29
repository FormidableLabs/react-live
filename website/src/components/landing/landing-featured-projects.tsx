import React from "react";
import { FeaturedBadge } from "formidable-oss-badges";
import { NFLinkButton } from "./nf-link-button";
import { LandingDivider } from "./landing-divider";

type featuredProject =
  | "renature"
  | "spectacle"
  | "urql"
  | "victory"
  | "nuka"
  | "owl"
  | "groqd"
  | "envy"
  | "figlog";

export const LandingFeaturedProjects = ({
  heading,
  projects,
  showDivider,
}: {
  heading: string;
  projects: {
    name: featuredProject;
    link: string;
    description: string;
    title?: string;
  }[];
  showDivider?: boolean;
}) => (
  <div className="flex flex-col text-left mx-16 lg:mx-32 xl:mx-64 mt-12 py-12">
    {showDivider && <LandingDivider />}
    <h2 className="my-8 text-4xl font-semibold">{heading}</h2>
    <div className="grid grid-cols-2 gap-8">
      {projects.map(({ name, link, description, title }) => (
        <a
          href={link}
          key={link}
          className="col-span-2 sm:col-span-1 block grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 align-center items-center text-theme-2 hover:text-theme-2 dark:text-white dark:hover:text-white"
        >
          <FeaturedBadge name={name} isHoverable className="col-span-1" />
          <span className="flex flex-col col-span-1 lg:col-span-2">
            <span className="text-xl font-semibold capitalize">
              {title || name}
            </span>
            <span className="text-sm ">{description}</span>
          </span>
        </a>
      ))}
    </div>

    <div className="my-8 pt-8 align-center">
      <NFLinkButton link="https://commerce.nearform.com/open-source">
        View All Projects
      </NFLinkButton>
    </div>
  </div>
);
