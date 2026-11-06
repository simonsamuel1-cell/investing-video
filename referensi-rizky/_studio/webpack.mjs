/**
 * Lets Rizky's five projects run inside our Studio (src/RizkyComps.jsx) without touching a file of theirs: inside
 * referensi-rizky/<project>/src/, "remotion" resolves to _studio/<project>.tsx. Used by remotion.config.ts and
 * scripts/stills.mjs (the Node API doesn't read the config).
 */
class RizkyRemotion {
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap("RizkyRemotion", (factory) => {
      factory.hooks.beforeResolve.tap("RizkyRemotion", (data) => {
        if (data.request !== "remotion") return;
        const project = (data.contextInfo.issuer ?? "").match(/^(.*\/referensi-rizky)\/([^/]+)\/src\//);
        if (project) data.request = `${project[1]}/_studio/${project[2]}.tsx`;
      });
    });
  }
}

export const withRizky = (config) => ({ ...config, plugins: [...(config.plugins ?? []), new RizkyRemotion()] });
