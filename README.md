# Context Element React

Context Element React extends [Context Element](https://github.com/Meiuca/context-element) to add native React support.

## Installation

This package is only available on Github.

`yarn add Meiuca/context-element-react`

or

`yarn add https://github.com/Meiuca/context-element-react.git`

## Getting Started

### What Is Context?

Context is a way of represent style variables (such as border-radius, background-color, etc.) so that they are dynamic and easy to
change at runtime. In this way, it is possible to generate and control visual changes more easily.

### Building a Context Element

#### Body

```jsx
// index.js
import { ContextElement } from '@meiuca/context-element-react';
import style from './styles.js';

export default function MyInput({ required, placeholder, type, label }) {
  return (
    <ContextElement contextId={`my-input`} styles={style}>
      <label className={`my-Input-label`}>
        <span>{label}</span>
        <input
          className={`my-Input`}
          type={type || 'text'}
          placeholder={placeholder}
          required={required}
        />
      </label>
    </ContextElement>
  );
}
```

#### Style

```js
// style.js
import { createGooberGetter as css } from '@meiuca/context-element';
import { inputContext } from './contexts.js';

export default css`
  /* default context: ${inputContext} */

  &.my-Input-label {
    display: flex;
    flex-direction: column;

    span {
      color: ${({ label }) => label.color};
      font-size: ${({ label }) => label.fontSize};
      font-weight: ${({ label }) => label.fontWeight};
      font-family: ${({ label }) => label.fontFamily};
      margin-bottom: ${({ label }) => label.margin};
      line-height: ${({ label }) => label.lineHeight};
    }

    input {
      border-style: ${context => context.borderStyle};
      border-width: ${context => context.borderWidth};

      border-color: ${context => context.borderColor};
      padding: ${context => context.padding};
      background-color: transparent;
      outline: none;

      ::placeholder {
        color: ${({ placeholder }) => placeholder.color};
        font-size: ${({ placeholder }) => placeholder.fontSize};
        font-weight: ${({ placeholder }) => placeholder.fontWeight};
        font-family: ${({ placeholder }) => placeholder.fontFamily};
        line-height: ${({ placeholder }) => placeholder.lineHeight};
      }
    }
  }
`;
```

Context Element React also exports the `createLitGetter`, which generates a compatible getter without using Goober.

### How does it work?

`ContextElement` is a wrapper that handles context.
See [ContextElement](./src/context-element.d.ts#L22).

`<ContextElement styles={...}>` accepts a single (or an array of) [StyleGetter](https://github.com/Meiuca/context-element/blob/main/src/css.d.ts#L9). Default is `[]`.

`<ContextElement insertOnIndex={...}>` accepts `number`, `number[]` or `boolean`. Default is `true`.

> If `boolean`, controls whether `styleIdList` will be inserted in all direct children or not
>
> If `number`, insert the `styleIdList` into the direct child whose index is equal to `number`
>
> If `number[]`, follows the same rule as `number` but with support for multiple indexes

`createGooberGetter` is a template string tag that uses the [CreateStyleGetterProps](https://github.com/Meiuca/context-element/blob/main/src/css.d.ts#L33) interface,
thus, the first interpolation must be used to inject the default context, and the other interpolations must use callbacks to obtain it;
in this way, context values ​​can be changed at runtime (via `setContext`).

The Context Element creates two global objects: `DSRegistry` and `DSContext`.

> `DSRegistry` is an array where all instances of ContextElement register itself, thus being able to be easily accessed by other entities,
> such as [updateRegisteredComponents](https://github.com/Meiuca/context-element/blob/main/src/context.d.ts#L9) function.
>
> `DSContext` is a map that can contain the contexts of the components. Initially it is an empty instance,
> but it is used by `setContext` to store contexts that will override their respective default. The override is made with the merge strategy.

When updated, the ContextElement will try to get their context from `DSContext` and will merge it with the default context.
Then will pass it on to the callbacks.

Note that, unlike [Context Element (WC)](https://github.com/Meiuca/context-element#how-does-it-work), the component's context pointer (`this.contextId`) is set directly by `<ContextElement contextId={...}>`.

#### setContext

This function has 4 overloads.

```js
setContext('https://url.to.global.context/'); // `https://url.to.global.context/` will return `{"my-input": {"color": "#ddd"}}`

setContext({ 'my-input': { color: '#ddd' } });

setContext('my-input', { color: '#ddd' });

setContext('my-input', 'https://url.to.component.context/'); // `https://url.to.component.context/` will return `{"color": "#ddd"}`
```

So let's say MyInput has, as a default context, `{color: "blue", fontSize: "20px"}`;
after being instantiated, its context will be `{color: "#ddd", fontSize: "20px"}`. If `this.contextId` is changed at some point,
the instance will lose the previous reference and, if the new pointer does not exist in `DSContext`, the default context will take over.

## Contributing

Any contribution is welcome, as long as you follow the rules of prettier, eslint, commitlint,
tests and [git branch](https://danielkummer.github.io/git-flow-cheatsheet)

### Prettier

all files must be formatted using prettier, whose behavior is determined by [.prettierrc](./.prettierrc)

### Eslint

extends [@open-wc/eslint-config](https://open-wc.org/guides/tools/linting-and-formatting/#linting-config). See [.eslintrc](./.eslintrc)

### Commitlint

extends [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)
and adds the following scopes (see [commitlint.config.js](./commitlint.config.js)):

- eslint: any eslint config or dependency change

- prettier: any prettier config or dependency change

- babel: any babel config or dependency change

- commitlint: any commitlint config or dependency change

- snowpack: any snowpack config or dependency change

- web-test-runner: any web-test-runner config or dependency change

- husky: any husky config or dependency change

- husky-controller: any husky-controller config or dependency change

- server: any change to the `server.js` file

- vscode: any change to the `.vscode` folder

- `('./src/*.js', 'src#')`: any change to any js file inside `src` folder; prefixed by `src#`. Example: `src#context.js`

- `('./test/*.js', 'test#')`: any change to any js file inside `test` folder; prefixed by `test#`

- package-json: any change to the `package.json` file that do not affect any of the previous scopes

Before committing, please make sure that husky is properly installed, Especially if you are a [mac user](https://stackoverflow.com/questions/8598639/why-is-my-git-pre-commit-hook-not-executable-by-default).
