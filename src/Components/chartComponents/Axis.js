import React from "react";
import PropTypes from "prop-types";

const d3 = require("d3");

class Axis extends React.PureComponent {
    constructor(props) {
        super(props);
        this.axisRef = React.createRef();
    }
    componentDidUpdate() { this.renderAxis(); };
    componentDidMount() { this.renderAxis(); };

    renderAxis = () => {
        let axis = d3.select(this.axisRef.current).call(this.props.axis);
        axis.selectAll(".tick line")
            .attr("stroke", "#000")
            .attr("stroke-opacity", "0.1");

        axis.selectAll("text").attr("color", "#999");

        axis.selectAll("path")
            .attr("stroke", "#000")
            .attr("stroke-opacity", "0");

        if (this.props.axisType == 'x') {
            axis.selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");
        }
    };

    render() {
        //console.log("Render Axis");
        var translate = "translate(0," + (this.props.h) + ")";

        return (
            <g ref={this.axisRef} className="axis" transform={this.props.axisType == 'x' ? translate : ""} >
            </g>
        );
    }
};

Axis.propTypes = {
    h: PropTypes.number,
    axis: PropTypes.func,
    axisType: PropTypes.oneOf(['x', 'y']),
}

export default Axis;