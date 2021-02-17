import { json } from "d3-fetch";
import { timeParse } from "d3-time-format";
import { fredUnits } from "./utils";
import { timeFormat } from "d3-time-format";
import { timeMonth } from "d3-time";

import { AMinusB } from "./fredFunctions";

const parseTime = timeParse("%Y-%m-%d");
const parseLastUpdated = timeParse("%Y-%m-%d");

//const fred = require('fred-api');
//const FRED = new fred("f03c8ce7f9abbc474ccb57117ac26c86");

// FRED.getSeriesObservations({ series_id: 'GNPCA' }, (error, result) => {
//     //console.log(result);
// });

const apiKey = "f03c8ce7f9abbc474ccb57117ac26c86"; //GOOD THING I AM NOT PUBLICALLY HOSTING THIS ON GITHUB, OTHERWISE THIS WOULD BE PRETTY DUMB

function dataSeries(id, start, units) {
    return `https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${apiKey}&observation_start=${start}&units=${units}&file_type=json`;
}

function dataInfo(id, start, units) {
    return `https://api.stlouisfed.org/fred/series?series_id=${id}&api_key=${apiKey}&observation_start=${start}&units=${units}&file_type=json`;
}

function responseDefault(response, id, name) {
    let dataSet = [];
    response[0].observations.forEach((element) => {
        //console.log(element);
        // console.log(parseTime(element.date));

        dataSet.push({
            date: parseTime(element.date),
            value: +element.value,
            key: id,
            name: name,
        });
    });

    //console.log("dataset", dataSet)
    return dataSet;
}


export default function fredData(id, start = "2007-03-01", units = "pc1", name, func) {
    if (!name) {
        name = id;
    }

    if (typeof id == "string") {
        return Promise.all([
            json(dataSeries(id, start, units)),
            json(dataInfo(id, start, units))
        ])
            .then((response) => {
                if (!func) {
                    return responseDefault(response,id,name);
                } else {
                    return func(response,id,name)
                }
                
            })
            .catch((error) => {
                console.warn(error);
            });
    } else if (Array.isArray(id)) {
        let set = id.map((d) => {
            return json(dataSeries(d, start, units))
        })
        return Promise.all(set)
            .then((responses) => {
                return func(responses, id, name)
            })
            .catch((error) => {
                console.warn(error);
            });
    }
}

