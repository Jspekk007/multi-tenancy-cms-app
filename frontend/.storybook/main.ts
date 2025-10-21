import { createRequire } from "node:module";
import type { StorybookConfig } from "@storybook/react-vite";
import { resolve, dirname, join } from "path";

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  framework: { name: getAbsolutePath("@storybook/react-vite"), options: {} },
  core: { disableTelemetry: true },

  stories: [
    "../src/components/**/*.stories.@(ts|tsx|mdx)",
    "../src/**/*.stories.@(ts|tsx|mdx)",
  ],

  addons: [getAbsolutePath("@storybook/addon-links"), getAbsolutePath("@storybook/addon-docs")],

  viteFinal: async (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        "@": resolve(__dirname, "../src"),
      },
    };
    return config;
  }
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
