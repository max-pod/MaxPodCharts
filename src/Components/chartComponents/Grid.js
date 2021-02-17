import React from "react";
import PropTypes from "prop-types";

const d3 = require("d3");

class Grid extends React.PureComponent {
    constructor(props) {
        super(props);
        this.gridRef = React.createRef();
    }

    componentDidUpdate() { this.renderGrid(); };
    componentDidMount() { this.renderGrid(); };

    renderGrid = () => {
        let grid = d3.select(this.gridRef.current).call(this.props.grid)

        grid.selectAll("line")
            .attr("stroke", "#000")
            .attr("stroke-opacity", "0.3")
            .attr("stroke-width", "1px");

        grid.selectAll("text")
            .attr("color", "#999")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        grid.selectAll("path")
            .attr("stroke-opacity", "0");

        if (this.props.special) {
            grid.selectAll("g.tick").filter((d) => {
                return this.props.special.includes(d);
            }).select('line')
                .attr("stroke-width", "2px")
                .attr("stroke-opacity", ".7")
                .attr("stroke", '#FF0000')
        }
    };

    render() {
        //console.log("Render Grid");
        var translate = "translate(0," + (this.props.h) + ")";
        return (
            <g ref={this.gridRef} className="y-grid" transform={this.props.gridType == 'x' ? translate : ""}/>
        );
    }
};

Grid.propTypes = {
    h: PropTypes.number,
    grid: PropTypes.func,
    gridType: PropTypes.oneOf(['x', 'y']),
    special: PropTypes.array,
}

export default Grid;