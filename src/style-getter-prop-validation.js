export default function styleGetter(props, propName, componentName) {
  if (typeof props[propName] !== 'function' || !props[propName].extract) {
    throw new Error(
      `Invalid prop '${propName}' supplied to '${componentName}'. It is not a StyleGetter.`,
    );
  }
}
