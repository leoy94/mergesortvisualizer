function addFocusAnimation (left, right, animations) {
    // console.log({name: "focus", left: left, right: right});
    animations.push({name: "focus", left: left, right: right});
    return animations;
}

function addMergeAnimation (start, end, animations) {
    animations.push({name: "merge", start: start, end: end});
    return animations;
}

function addSplitAnimation(right, animations){
    animations.push({name: "split", end: right});
    return animations;
}

function addSelectAnimation(index1,index2, animations){
    animations.push({name: "select", index1, index2});
    return animations;
}

function addMoveAnimation(itemIndex,toIndex, animations){
    animations.push({name: "move", itemIndex, toIndex});
    return animations;
}

export function mergeSortHelper(array) {
    let animations = [];

    let sortedArray = [...array];

    sortedArray = mergeSort(sortedArray, 0, sortedArray.length-1, animations);
    return {sortedArray, animations};
}


// Merge Sort Implentation (Recursion)
export function mergeSort (unsortedArray, leftIndex, rightIndex, animations) {
    // No need to sort the array if the array only has one element or empty

    addFocusAnimation (leftIndex, rightIndex, animations);
    addSelectAnimation(leftIndex, rightIndex, animations);
    if (unsortedArray.length <= 1) {
        return unsortedArray;
    }

    // In order to divide the array in half, we need to figure out the middle
    const middle = Math.ceil(unsortedArray.length / 2);


    const realMiddle = Math.floor(((leftIndex+rightIndex)/2));
    // This is where we will be dividing the array into left and right
    let leftArr = unsortedArray.slice(0, middle);
    let rightArr = unsortedArray.slice(middle);

    addSplitAnimation(realMiddle, animations);
    // Using recursion to combine the left and right
    leftArr = mergeSort(leftArr, leftIndex, realMiddle, animations);

    rightArr = mergeSort(rightArr, realMiddle+1, rightIndex, animations);

    addFocusAnimation (leftIndex, rightIndex, animations)
    addSelectAnimation(leftIndex, rightIndex, animations);
    addMergeAnimation(leftIndex, rightIndex, animations);
    let mergedArr = merge(leftArr, rightArr, leftIndex, realMiddle+1, animations);

    return mergedArr;
}

function merge (left, right, leftBound, rightBound, animations) {
    let resultArray = [], leftIndex = 0, rightIndex = 0;
    let realLeftIndex = leftBound;
    let realRightIndex = rightBound;
    // We will concatenate values into the resultArray in order
    while (leftIndex < left.length && rightIndex < right.length) {
        addSelectAnimation(leftBound, rightBound, animations);
        if (left[leftIndex] < right[rightIndex]) {
            resultArray.push(left[leftIndex]);
            addSelectAnimation(realLeftIndex, realRightIndex, animations);
            addMoveAnimation(realLeftIndex,realLeftIndex,animations);

            leftIndex++; // move left array cursor
            realLeftIndex++;
        } else {
            resultArray.push(right[rightIndex]);
            addSelectAnimation(realLeftIndex, realRightIndex, animations);
            addMoveAnimation(realRightIndex,realLeftIndex,animations);
            rightIndex++; // move right array cursor
            realLeftIndex++;
            realRightIndex++;
        }
    }

    // We need to concat here because there will be one element remaining
    // from either left OR the right
    return resultArray
        .concat(left.slice(leftIndex))
        .concat(right.slice(rightIndex));
}