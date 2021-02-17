import React, { useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import ActiveState from "./state/ActiveState";

const d3 = require("d3");
const maxCount = 6;

const renderLegend = (ref) => {
    d3.select(ref.current).selectAll("text").style("font-Size", "18px")
}

const position = (index, w) => {
    let x = (index % maxCount !== 0) ? index % maxCount - 1 : maxCount - 1;
    return [30 + w / maxCount * (x), Math.ceil(index / maxCount) * 25]
}

const Legend = props => {
    const svgRef = useRef();
    const [ activeState, setActiveState ] = useRecoilState(ActiveState)

    useEffect(() => {
        renderLegend(svgRef);
    }, []);

    let legends = props.sumstat.map((value, i) => {
        return (<g
            key={value.key}
            transform={`translate(${position(i + 1, props.w)})`}
            onMouseOver={() => setActiveState(i)}
            onMouseLeave={() => setActiveState(null)}
        >
            <circle
                fill={props.colors(props.sumstat.length)(i)}
                r={(i == activeState)? "10" : "6"}
            />
            <text
                fill={props.colors(props.sumstat.length)(i)}
                transform={`translate(15,12)`}
            >
                {value.key}
            </text>
        </g >)
    })


    return (
        <g ref={svgRef} className="legend" transform={`translate(0,${props.h + 50})`}>
            {legends}
        </g>
    );
};

export default Legend;