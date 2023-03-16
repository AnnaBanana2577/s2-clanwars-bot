export default function splitArrayIntoChunks(arr, numb) {
  const newarray = chunks(arr, numb);
  return [...newarray];
}

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}
