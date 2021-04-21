import { FunctionComponent } from 'react';
import { StyleGetter } from '@meiuca/context-element/src/css';

declare interface ContextElementProps {
  styles: StyleGetter | Array<StyleGetter>;
  contextId: string;
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
