import { ContextElement } from './context-element';

export * from '@jota-ds/context-element/src/global-props';
export * from '@jota-ds/context-element/src/css';
export * from '@jota-ds/context-element/src/context';
export { default as ContextElement } from './context-element.js';

declare global {
  interface Window {
    DSContext?: Map<string, any>;
    DSRegistry?: Array<ContextElement>;
    /**
     * This is a global module declaration
     * that will only exist if you import
     * `@jota-ds/context-element-react/src/module-declaration.js`
     */
    ContextElement?: typeof import('./index');
  }
}
