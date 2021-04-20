import { Children, useState, useEffect } from 'react';
import { isArray } from 'lodash';
import PropTypes from 'prop-types';
import styleGetter from './style-getter-prop-validation.js';

function ContextElement({ children, styles, contextId, insertOnIndex = true }) {
  this.contextId = contextId;

  /**
   * @type {import('@meiuca/context-element/src/css').StyleGetter[]}
   */
  this._styleGetterArray = isArray(styles) ? styles : [styles];

  this._initialState = {
    styleIdList: this._styleGetterArray.map(getter => getter.extract(contextId)),
  };

  const [state, setState] = useState(this._initialState);

  useEffect(() => {
    window.DSRegistry?.push(this);

    return () => {
      const selfRegistrationIndex = window.DSRegistry?.indexOf(this);

      if (selfRegistrationIndex >= 0) window.DSRegistry?.splice(selfRegistrationIndex, 1);
    };
  }, [state]);

  this.updateStyles = () => {
    const { _styleGetterArray } = this;

    const styleIdList = _styleGetterArray.map(getter => getter.extract(contextId));

    setState({ styleIdList });
  };

  if (!children) return null;

  const insertPropIsArray = isArray(insertOnIndex);
  const insertPropIsBool = typeof insertOnIndex === 'boolean';
  const insertPropIsNumber = typeof insertOnIndex === 'number';

  return Children.map(children, (child, index) => {
    if (
      (insertPropIsArray && !insertOnIndex.includes(index)) ||
      (insertPropIsNumber && insertOnIndex !== index) ||
      (insertPropIsBool && !insertOnIndex)
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
