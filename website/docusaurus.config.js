// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { themes } = require("prism-react-renderer");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "React Live",
  tagline: "A flexible playground for live editing React components",
  url: "https://formidable.com",
  baseUrl:
    process.env.VERCEL_ENV === "preview" ? "/" : "/open-source/react-live",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Formidable",
  projectName: "react-live", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          path: "../docs",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/FormidableLabs/react-live/tree/master/website",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [
    async function myPlugin() {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "React Live",
        items: [
          {
            href: "https://github.com/FormidableLabs/react-live",
            className: "header-github-link",
            "aria-label": "React Live GitHub Repository",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `As a global design and engineering consultancy, specializing in React.js, React Native, GraphQL, Node.js, and the extended JavaScript ecosystem - our Nearform team designs and builds digital solutions with impact for commerce businesses, leveraging composable architecture. With a global network of remote consultants, the focus is on delivering commerce-centric digital solutions. Copyright © ${new Date().getFullYear()} Nearform.`,
        logo: {
          src: "/img/nearform-icon.svg",
          alt: "Nearform",
          className: "footer-logo",
        },
        links: [
          {
            href: "https://commerce.nearform.com",
            label: "Nearform Commerce",
          },
        ],
      },
      prism: {
        theme: themes.nightOwlLight,
        darkTheme: themes.nightOwl,
      },
    }),
};

module.exports = config;
