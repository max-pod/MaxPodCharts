import React, { useEffect, useRef } from "react";
import { scaleLinear } from "d3-scale";
//import { easeQuadOut } from 'd3-ease'
//import { Animate } from "react-move";
import { motion, animate, useMotionValue } from "framer-motion"
import { useRecoilState } from 'recoil';
import ActiveState from "./state/ActiveState";

const getSmoothInterpolation = (indexSeries, line, xKey = "date", yKey = "value") => {
    const interpolate = scaleLinear()
        .domain([0, 1])
        .range([1, indexSeries.length + 1]);

    return function (t) {
        const flooredX = Math.floor(interpolate(t));
        let interpolatedLine = indexSeries.slice(0, flooredX);

        if (flooredX > 0 && flooredX < indexSeries.length) {
            const weight = interpolate(t) - flooredX;

            const x =
                indexSeries[flooredX][xKey] * weight +
                indexSeries[flooredX - 1][xKey] * (1 - weight);
            const y =
                indexSeries[flooredX][yKey] * weight +
                indexSeries[flooredX - 1][yKey] * (1 - weight);

            interpolatedLine.push({ [yKey]: y, [xKey]: x });
        }

        return line(interpolatedLine);
    };
}


const Line = props => {
    const path = useRef();
    const [ activeState, setActiveState ] = useRecoilState(ActiveState)
    let d = useMotionValue(0);

    console.log("render line");
    useEffect(() => {
        const interpolator = getSmoothInterpolation(props.values, props.line);
        const controls = animate(0, 1, {
            duration: 1,
            onUpdate(t) {
                d.set(interpolator(t))
            },
        })
        return controls.stop
    }, [props.values, props.line])

    return (
        <motion.path
            d={d}
            ref={path}
            className="line shadow"
            fill="none"
            strokeLinecap="round"
            strokeWidth={(props.i === activeState) ? "4px" : "2px"}
            stroke={props.color}
            onMouseOver={() => setActiveState(props.i)}
            onMouseLeave={() => setActiveState(null)}
        />
    )
}

const Lines = props => {
    let lines = props.sumstat.map((d, i) => {
        return <Line i={i} key={d.key} line={props.line} values={props.sumstat[i].values} active={props.active} getActive={props.getActive} color={props.colors(props.sumstat.length)(i)} />
    })

    console.log("Render Lines")

    return (
        <React.Fragment>
            { lines}
        </React.Fragment>
    );
}

const MemoLines = React.memo(Lines);

export default MemoLines;