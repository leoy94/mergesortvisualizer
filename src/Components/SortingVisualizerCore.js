import React, {useState, useEffect} from "react";
import "./SortingVisualizer.css";
import {mergeSortHelper} from "./AnimationHelper";


export default function SortingVisualizerCore () {
    const [arr, setArr] = useState(handleGenerateRandArr());
    const [focus, setFocus] = useState([0, arr.length - 1]);
    const [splits, setSplits] = useState([]);
    const [animations, setAnimations] = useState([])
    const [selected, setSelected] = useState([]);

    const handlefocus = handleFocusChange(setFocus);

    let handleSplit = function (splits, setSplits){
        return function (end) {
            splits.push(end);
            setSplits([...splits]);
            return splits;
        }
    };

    let handleMerge = function (splits, setSplits) {
        return function (start, end) {
            let splitItems = splits.filter((item) => { return ((item < start) || (item >= end))});
            setSplits([...splitItems]);
            return splitItems;
        }
    };

    return (
        <>
            <div className="array">
                {arr.map((item, index) => {
                    let backgroundColor = focus[0] <= index && index <=focus[1]? "blue": "lightgray";
                    if(selected.length>0){
                        backgroundColor = selected.some((item) => index === item)? "red": backgroundColor;
                    }

                    let width_right = splits.includes(index)?"5px": "";
                    let margin = splits.includes(index)?"0px 20px": "";
                    return(
                        <>
                        <div key={index} style={{
                            height: `${item*15}px`,
                            width: '15px',
                            backgroundColor: backgroundColor,
                            margin: "0px 2px"
                        }}>
                            {item}
                        </div>
                            <div style={{
                                width: width_right,
                                margin: margin,
                                backgroundColor: "orange"
                            }}></div>
                        </>

                    );
                })}
            </div>
        <button onClick={() => {
            setArr(handleGenerateRandArr());
            setAnimations([]);
            setSplits([]);
        }}
        >Generate Random Array</button>
        <button onClick={() => { setAnimations(mergeSortHelper(arr, 0, arr.length-1).animations)}}>Generate Animation Frames</button>
        <button onClick={()=> {animate(animations,handlefocus,[splits, setSplits],handleSplit,handleMerge,setSelected, arr, setArr)}}>
            Animate</button>
        </>
    );
}

async function animate(animations, handleFocus, splitState, handleSplit, handleMerge, handleSelect, array, setArray){
    let sortedArray = [...array];
    for (let animation in animations){
        await new Promise((resolve) => {
            setTimeout(() =>{
                resolve();
            }, 10);
        })

        if(animations){
                if (animations[animation].name === "focus") {
                    handleFocus(animations[animation].left, animations[animation].right);
                }
                else if (animations[animation].name === "split"){
                    splitState[0] = handleSplit(splitState[0], splitState[1])(animations[animation].end);
                }
                else if (animations[animation].name === "merge"){
                    splitState[0] = handleMerge(splitState[0], splitState[1])(animations[animation].start, animations[animation].end);
                }
                else if (animations[animation].name === "select"){
                    handleSelect([animations[animation].index1, animations[animation].index2]);
                }
                else if (animations[animation].name === "move"){
                    let itemIndex = animations[animation].itemIndex;
                    let leftBound = animations[animation].toIndex;

                    if(itemIndex !== leftBound){
                        let sortedArray = [...array];

                        let item = sortedArray.splice(itemIndex, 1);
                        sortedArray.splice(leftBound, 0, item[0]);
                        setArray([...sortedArray]);
                        array = sortedArray;
                    }
                }
            }
        }
}

function handleFocusChange(setFocus){
    return function (start, end){
        setFocus([start, end]);
    }
}

function handleGenerateRandArr(size){
    size = size?size:100;
    let arr = [];
    let current = 0;
    while(current < size){
        let number = 0;
        while(number < 1){
            number = Math.floor(Math.random() * 10);
        }
        arr.push(number);
        current++;
    }
    return arr;
    // return [5,2,4,1,8,4];
}