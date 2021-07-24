/**
 * Used by propTypes
 *
 * @type {import('prop-types').Requireable<import('@jota-ds/context-element').StyleGetter>}
 */
const styleGetter = (props, propName, componentName) => {
  if (typeof props[propName] !== 'function' || !props[propName].extract) {
    throw new Error(
      `Invalid prop '${propName}' supplied to '${componentName}'. It is not a StyleGetter.`,
    );
  }
};

// TODO: implement
styleGetter.isRequired = null;

export default styleGetter;
