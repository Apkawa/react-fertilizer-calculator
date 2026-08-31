> **Version 10.5** — **React** / **TypeScript**
> Also available:
- `?renderer=angular` for angular
- `?language=js` for JavaScript
- `?codeOnly=true` for code snippets only
- other versions: Version 9 (`/docs/9/get-started/frameworks/react-vite.md`), Version 8 (`/docs/8/get-started/frameworks/react-vite.md`)

# Storybook for React with Vite

Storybook for React & Vite is a [framework](https://storybook.js.org/docs/contribute/framework.md) that makes it easy to develop and test UI components in isolation for [React](https://react.dev/) applications built with [Vite](https://vitejs.dev/).

## Install

To install Storybook in an existing React project, run this command in your project's root directory:

```shell
npm create storybook@latest
```

```shell
pnpm create storybook@latest
```

```shell
yarn create storybook
```

You can then get started [writing stories](https://storybook.js.org/docs/get-started/whats-a-story.md), [running tests](https://storybook.js.org/docs/writing-tests.md) and [documenting your components](https://storybook.js.org/docs/writing-docs.md). For more control over the installation process, refer to the [installation guide](https://storybook.js.org/docs/get-started/install.md).

### Requirements

## Run Storybook

To run Storybook for a particular project, run the following:

```shell
npm run storybook
```

```shell
pnpm run storybook
```

```shell
yarn storybook
```

To build Storybook, run:

```shell
npm run build-storybook
```

```shell
pnpm run build-storybook
```

```shell
yarn build-storybook
```

You will find the output in the configured `outputDir` (default is `storybook-static`).

## FAQ

### How do I migrate from the React Webpack framework?

The `upgrade` command should prompt you to migrate to `@storybook/react-vite` when you run it:

```shell
npx storybook@latest upgrade
```

```shell
pnpm dlx storybook@latest upgrade
```

```shell
yarn dlx storybook@latest upgrade
```

In case that auto-migration does not work for your project, refer to the manual installation instructions below.

### How do I manually install the React framework?

First, install the framework:

```shell
npm install --save-dev @storybook/react-vite
```

```shell
pnpm add --save-dev @storybook/react-vite
```

```shell
yarn add --dev @storybook/react-vite
```

Then, update your `.storybook/main.js|ts` to change the framework property:

```ts
// .storybook/main.ts — CSF 3

const config: StorybookConfig = {
  // ...
  // framework: '@storybook/react-webpack5', 👈 Remove this
  framework: '@storybook/react-vite', // 👈 Add this
};

export default config;
```

```ts
// .storybook/main.ts — CSF Next 🧪
// Replace your-framework with the framework you are using (e.g., react-vite, nextjs, nextjs-vite)

export default defineMain({
  // ...
  // framework: '@storybook/react-webpack5', 👈 Remove this
  framework: '@storybook/react-vite', // 👈 Add this
});
```

## API

### Options

You can pass an options object for additional configuration if needed:

```ts
// .storybook/main.ts — CSF 3

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {
      // ...
    },
  },
};

export default config;
```

```ts
// .storybook/main.ts — CSF Next 🧪
// Replace your-framework with the framework you are using (e.g., react-vite, nextjs, nextjs-vite)

export default defineMain({
  framework: {
    name: '@storybook/react-vite',
    options: {
      // ...
    },
  },
});
```

#### `builder`

Type: `Record<string, any>`

Configure options for the [framework's builder](https://storybook.js.org/docs/api/main-config/main-config-framework.md#optionsbuilder). For this framework, available options can be found in the [Vite builder docs](https://storybook.js.org/docs/builders/vite.md).