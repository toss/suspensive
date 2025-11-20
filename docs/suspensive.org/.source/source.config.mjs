// source.config.ts
import { defineConfig } from "fumadocs-mdx/config/zod-3";
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
  },
  docs: [
    {
      dir: "src/content/en",
      output: "src/content/en/.map.ts"
    },
    {
      dir: "src/content/ko",
      output: "src/content/ko/.map.ts"
    }
  ]
});
export {
  source_config_default as default
};
