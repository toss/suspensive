// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config/zod-3";
import { remarkCodeHike, recmaCodeHike } from "codehike/mdx";
import { remarkSandpack } from "remark-sandpack";
var chConfig = {
  syntaxHighlighting: {
    theme: "github-dark"
  }
};
var source_config_default = defineConfig({
  generateManifest: true,
  lastModifiedTime: "git",
  mdxOptions: {
    remarkPlugins: [[remarkCodeHike, chConfig], remarkSandpack],
    recmaPlugins: [[recmaCodeHike, chConfig]]
  }
});
var docs = defineDocs({
  dir: "src/content",
  // Disable image optimization to avoid fetching external images during build
  remark: {
    images: {
      enabled: false
    }
  }
});
export {
  source_config_default as default,
  docs
};
