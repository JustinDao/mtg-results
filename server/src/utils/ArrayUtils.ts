export function splitArray<T>(arr: T[], numSections: number): T[][] {
  var retArr: T[][] = [];

  const sectionLength = Math.ceil(arr.length / numSections);

  for (var i = 0; i < arr.length; i += sectionLength) {
    retArr.push(arr.slice(i, i + sectionLength));
  }

  return retArr;
}
