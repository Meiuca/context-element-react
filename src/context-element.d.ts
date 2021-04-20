import { FunctionComponent } from 'react';
import { StyleGetter } from '@meiuca/context-element/src/css';

declare interface ContextElementProps {
  styles: StyleGetter | Array<StyleGetter>;
  contextId: string;
  insertOnIndex?: Array<number> | number | boolean;
}

declare const ContextElementWrapper: FunctionComponent<ContextElementProps>;

export default ContextElementWrapper;
