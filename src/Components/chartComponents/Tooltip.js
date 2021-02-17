import React from "react";
import { min, bisector } from "d3-array";
import { values } from "d3-collection";
import { timeFormat } from "d3-time-format";
//import { format } from "d3-format";

import { useRecoilState } from "recoil";
import MouseState from "./state/MouseState";

const bisectFunc = () => {
    return bisector((d) => d["date"]).left;
}

const xFormat = () => {
    return timeFormat("%b %d");
}

const Tooltip = props => {
    const [mouseState] = useRecoilState(MouseState);

    if (!mouseState) return null;

    let x0 = props.x.invert(mouseState - props.margin.left),
        iBisect = bisectFunc()(props.sumstat[0].values, x0, 1),
        xValBisect = props.sumstat[0].values[iBisect]["date"],
        xBisect = props.x(xValBisect)


    let yValBisect = props.sumstat.map((element, index) => {
        return element.values[iBisect]["value"]
    });

    let yBisect = yValBisect.map((element) => {
        return props.y(element)
    });

    let yMinBisect = min(values(yBisect));


    return (
        <g class="focus">
            <line
                class="x-tool"
                stroke="black"
                stroke-dasharray="3px"
                opacity=".5"
                y1="0"
                y2={props.h - yMinBisect}
                transform={`translate(${xBisect}, ${yMinBisect})`}
            />

            <line
                class="y-tool"
                stroke="black"
                stroke-dasharray="3px"
                opacity=".5"
                x2={props.w * 2}
                transform={`translate(${-props.w}, ${yMinBisect})`}
            />

            {props.sumstat.map((value, index) =>
                <circle
                    key={value.key}
                    class="circle-tool"
                    fill="white"
                    stroke="black"
                    r="4"
                    transform={`translate(${xBisect}, ${yBisect[index]})`}
                />
            )}
        </g>
    )
}

export default Tooltip;