export default function isEmptyObject(obj) {
  return (
    JSON.stringify(obj) === 'null'
    || JSON.stringify(obj) === 'undefined'
    || JSON.stringify(obj) === '{}'
  );
}
