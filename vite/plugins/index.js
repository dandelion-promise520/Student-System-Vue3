import vue from "@vitejs/plugin-vue";
import { codeInspectorPlugin } from "code-inspector-plugin";

import createAutoImport from "./auto-import";
import createSvgIcon from "./svg-icon";
import createCompression from "./compression";
import createSetupExtend from "./setup-extend";

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [
    vue(),
    codeInspectorPlugin({
      bundler: "vite",
      showSwitch: true,
    }),
  ];
  vitePlugins.push(createAutoImport());
  vitePlugins.push(createSetupExtend());
  vitePlugins.push(createSvgIcon(isBuild));
  isBuild && vitePlugins.push(...createCompression(viteEnv));
  return vitePlugins;
}
