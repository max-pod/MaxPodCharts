import React from 'react';
import PropTypes from 'prop-types'
import { nest } from 'd3-collection';
import { scaleOrdinal } from "d3-scale";
import { schemeSet1 } from "d3-scale-chromatic";
import recessionsObj from "../utils/recessionDates";

import Legend from "./chartComponents/Legend";
import Grid from "./chartComponents/Grid";
import Axis from "./chartComponents/Axis";
import Lines from "./chartComponents/Line";
import SpecialRect from "./chartComponents/SpecialRect";
import Tooltip from "./chartComponents/Tooltip";

import Layout from "./chartComponents/Layout"
import { RecoilRoot } from 'recoil';
const d3 = require("d3");


class LineChart extends React.Component {
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
        console.log("LOGGING", this.state.data);

        let data = this.state.data;
        let sumstat = nest()
            .key((d) => { return d.key })
            .entries(data);

        let margin = { top: 5, right: 50, bottom: 200, left: 50 },
            w = this.state.width - (margin.left + margin.right),
            h = this.props.height - (margin.top + margin.bottom);

        let x = d3.scaleTime()
            .domain(d3.extent(data, (d) => {
                return d.date;
            }))
            .rangeRound([0, w]);

        let dataMin = d3.min(data, (d) => {
            return d.value;
        })

        let dataMax = d3.max(data, (d) => {
            return d.value;
        })

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

        let line = d3.line()
            .x((d) => {
                return x(d.date);
            })
            .y((d) => {
                return y(d.value);
            })

        let colors = (length, fc) => {
            if (fc) {
                const colors = ['#FF0000', '#5B9BD5', '#009193'];
                return scaleOrdinal(colors).domain([0, length - 1]);
            }
            return scaleOrdinal(schemeSet1).domain([0, length - 1]);
        };

        // let lines = sumstat.map((d, i) => {
        //     return <Line key={d.key} d={line(d.values)} colors={colors(sumstat.length)} i={i} />
        // })

        const recessionDates = recessionsObj.slice(recessionsObj.length - 2);

        let recessions = '';
        if (this.props.showRecession) {
            recessions = recessionDates.map((d, i) => {
                return <SpecialRect key={d.key} xValue={d} x={x} h={h} />
            })
        }

        const legend = (this.props.showLegend) ? <Legend colors={colors} sumstat={sumstat} w={w} h={h} getActive={this.getActive} active={this.state.active} /> : null;

        return (
            <Layout
                id={this.props.chartId}
                width={this.state.width}
                height={this.props.height}
                margin={margin}
                legend={legend}
            >
                <Grid h={h} grid={yGrid} gridType="y" special={this.props.ySpecial} />
                <Axis h={h} axis={yAxis} axisType="y" />
                <Axis h={h} axis={xAxis} axisType="x" />
                {recessions}
                <Lines line={line} sumstat={sumstat} colors={colors} active={this.state.active} getActive={this.getActive} />
                <Tooltip sumstat={sumstat} x={x} y={y} margin={margin} offsetX={20} />
            </Layout>
        );
    }
};

LineChart.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    chartId: PropTypes.string,
    ySpecial: PropTypes.array,
    showRecession: PropTypes.bool,
}

LineChart.defaultProps = {
    width: 800,
    height: 700,
    chartId: 'v1_chart',
    showRecession: false,
}

export default LineChart;