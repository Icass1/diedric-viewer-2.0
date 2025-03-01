export function compareArrays(array1, array2) {
    // if the other array is a falsy value, return
    if (!array1) return false;
    // if the argument is the same array, we can be sure the contents are same as well
    if (array1 === array2) return true;
    // compare lengths - can save a lot of time
    if (array2.length != array1.length) return false;

    for (let i = 0, l = array2.length; i < l; i++) {
        // Check if we have nested arrays
        if (array2[i] instanceof Array && array1[i] instanceof Array) {
            // recurse into the nested arrays
            if (!array2[i].equals(array1[i])) return false;
        } else if (array2[i] != array1[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
