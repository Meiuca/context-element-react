import { Children, useState, useEffect } from 'react';
import { isArray } from 'lodash';
import PropTypes from 'prop-types';
import styleGetter from './style-getter-prop-validation.js';

function ContextElement({ children, styles = [], contextId, insertOnIndex = true }) {
  if (!globalThis.window.DSRegistry) {
    // Interrupt instance creation, since `DSRegistry` has not been declared
    throw new Error('DSRegistry is not defined');
  }

  this.contextId = contextId;

  /**
   * @type {import('@meiuca_design/context-element/src/css').StyleGetter[]}
   */
  this._styleGetterArray = isArray(styles) ? styles : [styles];

  this._initialState = {
    styleIdList: this._styleGetterArray.map(getter => getter.extract(contextId)),
  };

  const [state, setState] = useState(this._initialState);

  useEffect(() => {
    // Register itself when instantiated
    globalThis.window.DSRegistry.push(this);

    // Remove itself from registry when removed from the DOM
    return () => {
      const selfRegistrationIndex = globalThis.window.DSRegistry.indexOf(this);

      if (selfRegistrationIndex >= 0) globalThis.window.DSRegistry.splice(selfRegistrationIndex, 1);
    };
  }, []);

  this.updateStyles = () => {
    const { _styleGetterArray } = this;

    const styleIdList = _styleGetterArray.map(getter => getter.extract(this.contextId));

    setState({ styleIdList });
  };

  if (!children) return null;

  const insertPropIsArray = isArray(insertOnIndex);
  const insertPropIsBool = typeof insertOnIndex === 'boolean';
  const insertPropIsNumber = typeof insertOnIndex === 'number';

  // map `children` to insert `styleIdList`
  return Children.map(children, (child, index) => {
    if (
      // `insertOnIndex` is `number[]` and does not include `index`
      (insertPropIsArray && !insertOnIndex.includes(index)) ||
      // `insertOnIndex` is `number` and its different from `index`
      (insertPropIsNumber && insertOnIndex !== index) ||
      // `insertOnIndex` is `boolean` and its value is `false`
      (insertPropIsBool && !insertOnIndex) ||
      // `child` is not a ReactElement
      !child.props
    ) {
      return child;
    }

    const childClassName = child.props.className || '';

    const separator = state.styleIdList.length > 0 && childClassName ? ' ' : '';

    return {
      ...child,
      props: {
        ...child.props,
        className: childClassName + separator + state.styleIdList.join(' '),
      },
    };
  });
}

function ContextElementWrapper(props) {
  return new ContextElement(props);
}

ContextElementWrapper.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.arrayOf(styleGetter), styleGetter]).isRequired,
  insertOnIndex: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.number,
    PropTypes.bool,
  ]),
  contextId: PropTypes.string.isRequired,
};

export default ContextElementWrapper;
