import { timeParse } from "d3-time-format";
import RecessionsObj from "../utils/recessionDates"
import { dateDiffInDays } from "./utils";
import { maxIndex, bisector } from "d3-array";
const parseTime = timeParse("%Y-%m-%d");


export function AMinusB(d, id, name) {
    let dataSet = [];

    d[0].observations.forEach((element, index) => {
        dataSet.push({
            date: parseTime(element.date),
            value: +element.value - d[1].observations[index].value,
            key: `${id[0]}-${id[1]}`,
            name: name
        });
    })

    return dataSet;
}

export function RecessionCompare(responses, id, name) {
    let dataSet = [];
    let values = responses[0].observations;
    let splicedValues = [];

    //Define a Bisector Function
    const recessionBisector = bisector((d) => {
        return d.peak
    }).left;

    const observation_start = responses[1].seriess[0].observation_start;
    const closestRecession = recessionBisector(RecessionsObj, observation_start, 1)

    //Grab Only the Necessary Recession Dates
    let recessionsObj = RecessionsObj.slice(closestRecession);
    recessionsObj[recessionsObj.length - 1].trough =
        values[values.length - 1].date;

    //Define a Bisector Function
    const dateBisector = bisector((d) => {
        return d.date
    }).right;

    //Define indexTrough
    recessionsObj.forEach((recession, index) => {
        let indexTrough = dateBisector(values, recession.trough, 1) - 1;
        let indexPeak = dateBisector(values, recession.peak, 1) - 1;
        recession.indexTrough = indexTrough;
        recession.indexPeak = indexPeak;
        //console.log("key", recession.key, "closet trough at: ", values[indexTrough].date,"to ", recession.trough)
    });

    //Define a Bisector Function
    const valueBisector = bisector((d) => {
        return d.value
    }).left;

    //Use indexTrough
    recessionsObj.forEach((recession, index) => {
        let start;
        (index == 0) ? start = 0 : start = recessionsObj[index - 1].indexTrough;
        let slice = values.slice(start, recession.indexTrough + 1)

        let sliceMaxIndex = maxIndex(slice, (d) => {
            return +d.value;
        });

        let sliceMaxObj = slice[sliceMaxIndex];

        let end;
        (index != recessionsObj.length - 1) ? end = recessionsObj[index + 1].indexPeak : end = values.length;

        //console.log(sliceMaxIndex, start, sliceMaxIndex + start, recession.indexPeak);

        let nextSlice = values.slice(sliceMaxIndex + start, end + 1);

        let recoveryIndex
        (index != recessionsObj.length - 1) ? recoveryIndex = valueBisector(nextSlice, sliceMaxObj.value, 1) : recoveryIndex = nextSlice.length;

        let recoverySlice = nextSlice.slice(0, recoveryIndex + 1)

        //console.log("recovery Index", recoveryIndex);
        //console.log("recovery Slice", recoverySlice);
        //console.log("next slice recovery", nextSlice[recoveryIndex - 1], recoveryIndex, nextSlice.length, nextSlice)

        splicedValues.push({
            key: recession.key,
            slice,
            recoverySlice,
            sliceMaxVal: sliceMaxObj.value,
            sliceMaxDate: sliceMaxObj.date,
            recoveryVal: nextSlice[recoveryIndex - 1].value,
            recoveryDate: nextSlice[recoveryIndex - 1].date,
            timeToRecover: dateDiffInDays(parseTime(sliceMaxObj.date), parseTime(nextSlice[recoveryIndex - 1].date))
        })

        //console.log("key", recession.key, "Between: ",values[start].date,"-",values[recession.indexTrough].date,"highest val: ",sliceMaxObj.value,"on: ",sliceMaxObj.date, slice)
        //console.log("key", recession.key, "End", recession.indexPeak, values.slice(recession.indexPeak,end+1))
    })

    //console.log("spliceTest", splicedValues)

    splicedValues.forEach((element, index) => {

        let key = element.key;
        let slice = element.recoverySlice;
        let max = element.sliceMaxVal;
        let maxDate = element.sliceMaxDate

        slice.forEach((sliceValues) => {
            dataSet.push({
                value: (sliceValues.value - max) / max,
                date: dateDiffInDays(parseTime(maxDate), parseTime(sliceValues.date)),
                key: key,
            });
        });
    });

    return dataSet;
}