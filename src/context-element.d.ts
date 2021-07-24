import { FunctionComponent } from 'react';
import { StyleGetter } from '@jota-ds/context-element/src/css';

declare interface ContextElementProps {
  /**
   * Array of style getters to apply to the element. The getters should be defined
   * using the `createGooberGetter` or `createLitGetter` tag function.
   */
  styles?: StyleGetter | Array<StyleGetter>;
  contextId: string;
  /**
   * - If `boolean`, controls whether `styleId` will be inserted in all direct children or not
   * - If `number`, insert the `styleId` into the direct child whose index is equal to `number`
   * - If `number[]`, follows the same rule as `number` but with support for multiple indexes
   */
  insertOnIndex?: Array<number> | number | boolean;
}

export interface ContextElement {
  contextId: string;
  updateStyles: () => void;

  private _styleGetterArray: Array<StyleGetter>;
  private _initialState: {
    styleIdList: string[];
  };
}

declare const ContextElementWrapper: FunctionComponent<ContextElementProps>;

export default ContextElementWrapper;
