// Docusaurus resolves static image imports through webpack loaders; TypeScript
// needs to be told they exist. @docusaurus/module-type-aliases covers @theme/*
// and @docusaurus/*, but not assets.
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}
declare module "*.gif" {
  const src: string;
  export default src;
}
