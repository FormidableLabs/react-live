// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { themes } = require("prism-react-renderer");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "React Live",
  tagline: "A flexible playground for live editing React components",
  url: "https://commerce.nearform.com",
  baseUrl: "/open-source/react-live",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/nearform-icon.svg",

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
          routeBasePath: "/docs",
          path: "../docs",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/FormidableLabs/react-live/tree/master/website",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-M971D063B9",
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
        logo: {
          alt: "Nearform",
          src: "/img/nearform-logo-white.svg",
        },
        items: [
          { to: "docs", label: "Documentation", position: "left" },
          {
            href: "https://github.com/FormidableLabs/react-live",
            className: "header-github-link",
            "aria-label": "GitHub Repository",
            position: "right",
          },
        ],
      },
      footer: {
        logo: {
          alt: "Nearform logo",
          src: "img/nearform-logo-white.svg",
          href: "https://nearform.com",
          width: 100,
          height: 100,
        },
        copyright: `Copyright © 2013-${new Date().getFullYear()} Nearform`,
      },
      prism: {
        theme: themes.nightOwlLight,
        darkTheme: themes.nightOwl,
      },
    }),
};

module.exports = config;
