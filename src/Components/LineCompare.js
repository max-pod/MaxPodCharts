import React from 'react';
import PropTypes from 'prop-types'
import { nest } from 'd3-collection';
import { interpolateTurbo } from "d3-scale-chromatic";

import Legend from "./chartComponents/Legend"
import Grid from "./chartComponents/Grid"
import Axis from "./chartComponents/Axis"
import Lines from "./chartComponents/Line"

import Layout from "./chartComponents/Layout"

const d3 = require("d3");

class LineCompareChart extends React.Component {
    constructor(props) {
        super(props);
        this.getActive = this.getActive.bind(this);
        this.state = { width: this.props.width, data: [], active: null }
    }

    getActive = (id) => {
        this.setState({
            active: id,
        })
    }

    async componentDidMount() {
        Promise.all(this.props.data).then((responses) => {
            //console.log("HERE IS PROMISE RESPONSES", responses)
            let response = [];
            responses.forEach((d) => {
                response = response.concat(d)
            })

            this.setState({ data: response });
        })
    }

    render() {
        if (this.state.data[0] === undefined) {
            return (<div>Loading</div>);
        }
        console.log("Rendering Line Compare")

        let data = this.state.data;
        let sumstat = nest()
            .key((d) => { return d.key })
            .entries(data);

        let dataMin = d3.min(data, (d) => {
            return d.value;
        })

        let dataMax = d3.max(data, (d) => {
            return d.value;
        })

        let margin = { top: 5, right: 50, bottom: 200, left: 50 },
            w = this.state.width - (margin.left + margin.right),
            h = this.props.height - (margin.top + margin.bottom);

        let x = d3.scaleLinear()
            .domain(d3.extent(data, (d) => {
                return d.date;
            }))
            .rangeRound([0, w]);

        let y = d3.scaleLinear()
            .domain([dataMin > 0 ? 0 : dataMin, (dataMax * 7) / 6])
            .rangeRound([h, 0])
            .nice();;

        let yAxis = d3.axisLeft()
            .scale(y)
            .ticks(5);

        let xAxis = d3.axisBottom()
            .scale(x)
            .ticks(5);

        let yGrid = d3.axisLeft()
            .scale(y)
            .ticks(5)
            .tickSize(-w, 0, 0)
            .tickFormat("");

        const line = d3.line()
            .x((d) => {
                return x(d.date);
            })
            .y((d) => {
                return y(d.value);
            })

        const colors = (length) => {
            return (i) => { return interpolateTurbo((i + 1) / (length + 1)) };
        };

        const legend = (this.props.showLegend) ? <Legend colors={colors} sumstat={sumstat} w={w} h={h} getActive={this.getActive} active={this.state.active} /> : null;

        return (
            <Layout
                id={this.props.chartId}
                width={this.state.width}
                height={this.props.height}
                margin={margin}
                legend={legend}
            >
                <Grid grid={yGrid} gridType="y" special={this.props.ySpecial} />
                <Axis axis={yAxis} axisType="y" />
                <Axis axis={xAxis} axisType="x" />
                <Lines line={line} sumstat={sumstat} colors={colors} active={this.state.active} getActive={this.getActive} />
            </Layout>
        );
    }
};

LineCompareChart.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    chartId: PropTypes.string,
    ySpecial: PropTypes.array,
    showLegend: PropTypes.bool,
}

LineCompareChart.defaultProps = {
    width: 800,
    height: 700,
    chartId: 'v1_chart',
    showLegend: true,
}

export default LineCompareChart;