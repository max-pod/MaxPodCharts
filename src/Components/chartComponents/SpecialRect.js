import React from "react";

const SpecialRect = props => {
    let rectX = props.x(props.xValue.peakDate);
    let trough = (props.xValue.troughDate == "" || !props.xValue.troughDate) ? new Date() : props.xValue.troughDate;
    let w = props.x(trough) - rectX;

    return (
        <rect
            fill="grey"
            fillOpacity="0.5"
            className="special-rect"
            width={w}
            height={props.h}
            transform={`translate(${rectX},0)`}
        />
    )
}

export default SpecialRect;