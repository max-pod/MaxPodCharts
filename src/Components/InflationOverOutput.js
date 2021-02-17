import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { scaleOrdinal } from 'd3-scale'

import Layout from "./chartComponents/Layout"

const width = 800;
const height = 800;
const color = scaleOrdinal(schemeCategory10);

const LRAS = props => {
    const { w, h, margin } = props;
    const points = {
        x1: w / 2,
        x2: w / 2,
        y1: h - margin.bottom,
        y2: margin.top + 50,
    }
    props.getPoints(points);
    return (
        <motion.g drag="x">
            <line x1={points.x1} x2={points.x2} y1={points.y1} y2={points.y2} stroke={color(props.count)} strokeWidth="3px" />
            <text x={points.x2} y={points.y2}>LRAS{props.count}</text>
        </motion.g>
    )
}

const AS = props => {
    const { w, h, margin } = props;
    const points = {
        x1: margin.left + 50,
        x2: w - margin.right - 50,
        y1: h - margin.bottom - 50,
        y2: margin.top + 50,
    }
    props.getPoints(points);
    return (
        <motion.g
            drag="x"
            onDrag={
                (event) => {
                    
                }
            }
        >
            <line x1={points.x1} x2={points.x2} y1={points.y1} y2={points.y2} stroke={color(props.count)} strokeWidth="3px" />
            <text x={points.x2} y={points.y2}>AS{props.count}</text>
        </motion.g>
    )
}

const AD = props => {
    const { w, h, margin } = props;
    const points = {
        x1: margin.left + 50,
        x2: w - margin.right - 50,
        y1: margin.top + 50,
        y2: h - margin.bottom - 50
    };
    props.getPoints(points);
    return (
        <motion.g
            drag="x"
            onDrag={
                (event) => {
                    console.log("dragged to: ", event.layerX)
                    //points.x1 = points.x2 = event.layerX;
                }
            }
        >
            <line x1={points.x1} x2={points.x2} y1={points.y1} y2={points.y2} stroke={color(props.count)} strokeWidth="3px" />
            <text x={points.x2} y={points.y2}>AD{props.count}</text>
        </motion.g>
    )
}

const Intercepts = props => {
    const { w, h, margin } = props;
    console.log("LOGGING POINTS: ", props.points);
    return null;
}

const Shock = props => {
    return (
        <React.Fragment>
            <button onClick={() => props.push.add()}>+ {props.id}</button>
            <button onClick={() => props.push.sub()}>- {props.id}</button>
        </React.Fragment>
    )
}

const shock = (id, count, setter, order, setOrder) => {
    const addFunc = (id, count, setter, order) => {
        const add = () => {
            setter(count + 1);
            setOrder([...order, { id: id, type: 'add', i: order.length, count: count + 1 }])
        }
        return add;
    }

    const subFunc = (id, count, setter, order) => {
        const sub = () => {
            if (count >= 1) {
                let find = order.find(obj => {
                    console.log("id: ", id, "obj.count", obj.count, "count", count);
                    return (obj.id === id && obj.count === count && obj.type === 'add')
                })

                if (!find) return;

                let found = order.filter(obj => {
                    return (obj.i !== find.i)
                });

                setter(count - 1);
                setOrder(found);
            }
        }
        return sub;
    }

    return { add: addFunc(id, count, setter, order), sub: subFunc(id, count, setter, order) };
}

const InflationOverOutput = props => {
    let [LRASCount, setLRASCount] = useState(1);
    let [ASCount, setASCount] = useState(1);
    let [ADCount, setADCount] = useState(1);
    let [order, setOrder] = useState([{ id: "LRAS", count: 1, i: 0, type: 'default' }, { id: "AS", count: 1, i: 1, type: 'default' }, { id: "AD", count: 1, i: 2, type: 'default' }]);
    let [points, setPoints] = useState([]);

    const alignRef = useRef(null);

    useEffect(() => {
        //console.log(alignRef.current.getBoundingClientRect());
    });

    const getPoints = (points, setPoints, i) => {
        const getPointsFunc = (point) => {
            points[i] = point;
            setPoints(points)
        }
        return getPointsFunc;
    }

    const margin = { top: 50, right: 50, bottom: 50, left: 50 },
        w = width - (margin.left + margin.right),
        h = height - (margin.top + margin.bottom);

    const average = (n1, n2) => {
        return (n1 + n2) / 2;
    }

    let lines = order.map((d, i) => {
        if (d.id === 'LRAS') {
            return <LRAS i={d.i} count={d.count} key={i} w={w} h={h} margin={margin} getPoints={getPoints(points, setPoints, i)} />
        } else if (d.id === 'AS') {
            return <AS i={d.i} count={d.count} key={i} w={w} h={h} margin={margin} getPoints={getPoints(points, setPoints, i)} />
        } else if (d.id === 'AD') {
            return <AD i={d.i} count={d.count} key={i} w={w} h={h} margin={margin} getPoints={getPoints(points, setPoints, i)} />
        } else {
            return null;
        }
    })

    console.log("points: ", points)

    return (
        <React.Fragment>
            <Layout
                id={"InflationOverOutput"}
                width={width}
                height={height}
                margin={margin}
            >
                <line ref={alignRef} x1={0} x1={0} y1={0} y2={0} />
                <line x1={margin.left} x2={w - margin.right} y1={h - margin.bottom} y2={h - margin.bottom} stroke="black" />
                <line x1={margin.left} x2={margin.left} y1={margin.top} y2={h - margin.bottom} stroke="black" />

                <text x={0} y={h / 2} transform={`rotate(270, ${0}, ${h / 2})`} >Inflation Rate</text>
                <text x={w / 2 - margin.right} y={h}>Aggregate Output</text>

                {lines}

                <Intercepts points={points} w={w} h={h} margin={margin} />

                <line x1={margin.left} x2={average(margin.left + 50, w - margin.right - 50)} y1={average(h - margin.bottom - 50, margin.top + 50)} y2={average(h - margin.bottom - 50, margin.top + 50)} stroke="steelblue" strokeDasharray="4" />
                <text x={margin.left - 10} y={average(h - margin.bottom - 50, margin.top + 50)} transform={`rotate(270, ${margin.left - 10}, ${average(h - margin.bottom - 50, margin.top + 50)})`}>*π</text>


                <line x1={average(margin.left + 50, w - margin.right - 50)} x2={average(margin.left + 50, w - margin.right - 50)} y1={average(h - margin.bottom - 50, margin.top + 50)} y2={h - margin.bottom} stroke="steelblue" strokeDasharray="4" />
                <text x={average(margin.left + 50, w - margin.right - 50)} y={h - margin.bottom + 25}>*Y</text>
            </Layout>
            <br />
            <Shock id="LRAS" push={shock("LRAS", LRASCount, setLRASCount, order, setOrder)} />
            <Shock id="AS" push={shock("AS", ASCount, setASCount, order, setOrder)} />
            <Shock id="AD" push={shock("AD", ADCount, setADCount, order, setOrder)} />
        </React.Fragment>
    );
};

export default InflationOverOutput;