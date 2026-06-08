# Vendored Frontend Assets

This directory is reserved for third-party frontend projects that are checked into the repository as static runtime assets.

Current contents:

- `jspaint/`: upstream JS Paint snapshot used by `src/client/apps/paint/index.tsx`

Guidelines:

- Keep first-party app assets in `public/assets/`
- Keep vendored/upstream code in `public/vendor/`
- Avoid importing vendored files into `src/` as if they were normal application source
- Cleanup of upstream lockfiles, tests, and development metadata should happen in separate hygiene PRs
