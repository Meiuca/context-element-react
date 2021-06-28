export default function classMap(obj) {
  const mapped = Object.entries(obj).map(([key, value]) => (value ? key : null));

  return mapped.filter(key => key).join(' ');
}
