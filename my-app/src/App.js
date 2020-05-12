import React from "react";
import { useState } from "react";
import "./App.css";
import { InfluxDB} from "@influxdata/influxdb-client";
import {
  Plot,
  timeFormatter,
  NINETEEN_EIGHTY_FOUR,
  fromFlux,
} from "@influxdata/giraffe";

const valueAxisLabel = "GHz";


const fetchData = (setMethod, setFetching) => {
  const url = "http://localhost:9999";
  const bucket = "my-bucket";
  const org = "my-org";
  const token = "cpLwIwX9sq-bwCRdoKS_gAmzjQFVgCow3DBRNJ5cDM7GnLyFVEuD80-uQ6-cY5z1zZKj8wPiZyMjcHDZPUYhNA==";
  const influxDB = new InfluxDB({
    url,
    token,
  });
  const fluxQuery =
  'from(bucket: "my-bucket")\
  |> range(start: -5m)\
  |> filter(fn: (r) => r["_measurement"] == "cpu")\
  |> filter(fn: (r) => r["_field"] == "usage_system")\
  |> filter(fn: (r) => r["cpu"] == "cpu-total")'
  console.log("\n*** QUERY ***");
  const queryApi = influxDB.getQueryApi(org);

  let table = [];
  let csv = "";

  queryApi.queryLines(fluxQuery, {
    next(line) {
      csv = `${csv}${line}\n`;
    },

    error(error) {
      setFetching("error");
      console.log("QUERY FAILED", error);
    },
    complete() {
      console.log(table);
      console.log("csv");
      // Use CSV, some time series data in annotated CSV instead of client for simple example 
      const CSV = `#group,false,false,true,true,false,false,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,example,location
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T18:31:33.95Z,29.9,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T18:55:23.863Z,28.7,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:50:52.357Z,15,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:53:37.198Z,24.8,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:53:53.033Z,23,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T20:19:21.88Z,20.1,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-10T22:20:40.776Z,28.7,value,temperature,index.html,browser`;
      console.log(csv);
      setMethod(fromFlux(csv));
      setFetching("fetched");
    },
  });
};

export default (props) => {
  console.log("Updating Component");
  console.log(props);

  const [table, setTable] = useState(null);
  const [fetching, setFetching] = useState("unfetched");
  let plotGraph = <p> Pending </p>;
  let scatterGraph = <p> Pending </p>;
  switch (fetching) {
    case "unfetched":
      console.log("unfetched");
      setFetching("fetching");
      fetchData(setTable, setFetching);
      break;

    case "error":
      console.log("error");
      plotGraph = <p> Error </p>;
      scatterGraph = <p> Error </p>;
      break;

    case "fetching":
      console.log("fetching");
      plotGraph = <p> Fetching </p>;
      scatterGraph = <p> Fethcing </p>;
      break;

    case "fetched":
      console.log("fetched");
      console.log(table);
      const lineConfig = {
        table: table.table,
        valueFormatters: {
          _time: timeFormatter({
            timeFormat: "UTC",
            format: "HH:mm",
          }),
          _value: (val) =>
            `${val.toFixed(2)}${
              valueAxisLabel ? ` ${valueAxisLabel}` : valueAxisLabel
            }`,
        },
        xScale: "linear",
        yScale: "linear",
        legendFont: "12px sans-serif",
        tickFont: "12px sans-serif",
        showAxes: true,
        layers: [
          {
            type: "line",
            x: "_time",
            y: "_value",
            fill: [],
            position: "overlaid",
            interpolation: "monotoneX",
            colors: NINETEEN_EIGHTY_FOUR,
            lineWidth: 1,
            hoverDimension: "auto",
            shadeBelow: true,
            shadeBelowOpacity: 0.1,
          },
        ],
      };

      const scatterConfig = {
        table: table.table,
        valueFormatters: {
          _time: timeFormatter({
            timeFormat: "UTC",
            format: "HH:mm",
          }),
          _value: (val) =>
            `${val.toFixed(2)}${
              valueAxisLabel ? ` ${valueAxisLabel}` : valueAxisLabel
            }`,
        },
        xScale: "linear",
        yScale: "linear",
        legendFont: "12px sans-serif",
        tickFont: "12px sans-serif",
        showAxes: true,
        layers: [
          {
            type: "scatter",
            x: "_time",
            y: "_value",
            fill: [],
            colors: NINETEEN_EIGHTY_FOUR,
            symbol: [],
          },
        ],
      };
      plotGraph = <Plot config={lineConfig} />;
      scatterGraph = <Plot config={scatterConfig} />;
      // plotGraph = <p>Fetched</p>;
      // scatterGraph = <p>Help</p>;
      break;
  }

  return (
    <>
      <h2 key="heading-1"> Giraffe Tutorial </h2>, A tutorial for creating a line graph with <a href="https://github.com/influxdata/giraffe">Giraffe</a> from InfluxDB using the JavaScript Client
      <h3 key="heading-1"> Visualizing cpu data</h3>A Line Graph
      <div
        style={{
          width: "calc(70vw - 20px)",
          height: "calc(70vh - 20px)",
          margin: "40px",
        }}
      >
        {plotGraph}
      </div>
      A Scatter Plot
      <div
        style={{
          width: "calc(70vw - 20px)",
          height: "calc(70vh - 20px)",
          margin: "40px",
        }}
      >
        {scatterGraph}
      </div>
    </>
  );
};
