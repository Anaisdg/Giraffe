import React from "react";
import { useState } from "react";
import "./App.css";
import { InfluxDB, FluxTableMetaData } from "@influxdata/influxdb-client";
import {
  Plot,
  newTable,
  timeFormatter,
  NINETEEN_EIGHTY_FOUR,
  fromFlux,
  fromRows,
} from "@influxdata/giraffe";

// const now = Date.now()
// const numberOfRecords = 80
// const recordsPerLine = 40
// const maxValue = 100
// const TIME_COL = []
// const VALUE_COL = []
// const CPU_COL = []

// function getRandomNumber(max) {
//     return Math.random() * Math.floor(max)
// }
// for (let i = 0; i < numberOfRecords; i += 1) {
//     VALUE_COL.push(getRandomNumber(maxValue))
//     CPU_COL.push(`cpu${Math.floor(i / recordsPerLine)}`)
//     TIME_COL.push(now + (i % recordsPerLine) * 1000 * 60)
// }

const valueAxisLabel = "bytes";

// const table = newTable(numberOfRecords)
//     .addColumn('_time', 'time', TIME_COL)
//     .addColumn('_value', 'number', VALUE_COL)
//     .addColumn('cpu', 'string', CPU_COL)

// console.log(table)

const numberOfRecords = 0;
const recordsPerLine = 2;
const maxValue = 100;
const TIME_COL = [];
const VALUE_COL = [];
const LOCATION_COL = [];

// function getRandomNumber(max) {
//     return Math.random() * Math.floor(max)
// }
// for (let i = 0; i < numberOfRecords; i += 1) {
//     VALUE_COL.push(getRandomNumber(maxValue))
//     CPU_COL.push(`cpu${Math.floor(i / recordsPerLine)}`)
//     TIME_COL.push(now + (i % recordsPerLine) * 1000 * 60)
// }

// const valueAxisLabel = "bytes"

// console.log(table)

// const rows = [
//   {foo: 1, bar: 0, baz: 0, a: 'A', b: '1'},
//   {foo: 3, bar: 1, baz: 1, a: 'B', b: '2'},
//   {foo: 5, bar: 2, baz: 0, a: 'C', b: '3'},
// ]

// const schema: {[k: string]: ColumnType} = {
//   foo: 'number',
//   bar: 'time',
//   baz: 'boolean',
//   a: 'string',
// }

// const table = newTable(numberOfRecords)
//     .addColumn('_time', 'time', TIME_COL)
//     .addColumn('_value', 'number', VALUE_COL)
//     .addColumn('location', 'string', LOCATION_COL)

const fetchData = (setMethod, setFetching) => {
  const url = "http://localhost:9999";
  const bucket = "my-bucket";
  const org = "my-org";
  const token =
    "cpLwIwX9sq-bwCRdoKS_gAmzjQFVgCow3DBRNJ5cDM7GnLyFVEuD80-uQ6-cY5z1zZKj8wPiZyMjcHDZPUYhNA==";
  const influxDB = new InfluxDB({
    url,
    token,
  });
  // const fluxQuery =
  //   'from(bucket: "my-bucket")\
  //   |> range(start: -5m) |> filter(fn: (r) => r["_measurement"] == "cpu")\
  //   |> filter(fn: (r) => r["_field"] == "usage_user")\
  //   |> filter(fn: (r) => r["cpu"] == "cpu-total" )\
  //   |> limit(n:5)'
  // const fluxQuery =
  //   'from(bucket:"my-bucket") |> range(start: -30d) |> filter(fn: (r) => r._measurement == "temperature")';
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
    // next(row, tableMeta) {
    //   const o = tableMeta.toObject(row);
    //   console.log(o);
    //   table.push(fromRows(row, tableMeta));
    // string += "shfhf"
    next(line) {
      // console.log(line)
      // csv = csv + line;
      csv = `${csv}${line}\n`;
    },

    error(error) {
      setFetching("error");
      console.log("QUERY FAILED", error);
    },
    complete() {
      console.log(table);
      console.log("csv");
      console.log(csv);
      // console.log("QUERY FINISHED");
      const CSV = `#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#group,false,false,true,true,false,false,true,true,true,true
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
,,0,2020-04-23T16:24:43.27259Z,2020-04-23T16:29:43.27259Z,2020-04-23T16:24:53Z,11.623547056617923,usage_system,cpu,cpu-total,Anais.attlocal.net
,,0,2020-04-23T16:24:43.27259Z,2020-04-23T16:29:43.27259Z,2020-04-23T16:25:03Z,6.3,usage_system,cpu,cpu-total,Anais.attlocal.net
,,0,2020-04-23T16:24:43.27259Z,2020-04-23T16:29:43.27259Z,2020-04-23T16:25:13Z,7.075884485560695,usage_system,cpu,cpu-total,Anais.attlocal.net
,,0,2020-04-23T16:24:43.27259Z,2020-04-23T16:29:43.27259Z,2020-04-23T16:25:23Z,8.184733803720334,usage_system,cpu,cpu-total,Anais.attlocal.net
,,0,2020-04-23T16:24:43.27259Z,2020-04-23T16:29:43.27259Z,2020-04-23T16:25:33Z,9.6259290849275,usage_system,cpu,cpu-total,Anais.attlocal.net
,,0,2020-04-23T16:24:43.27259Z,2020-04-23T16:29:43.27259Z,2020-04-23T16:25:43Z,7.824021997250344,usage_system,cpu,cpu-total,Anais.attlocal.net
,,0,2020-04-23T16:24:43.27259Z,2020-04-23T16:29:43.27259Z,2020-04-23T16:25:53Z,6.606719120769327,usage_system,cpu,cpu-total,Anais.attlocal.net`;

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

  // console.log("config", lineConfig)
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

      // const jsTable = table[0];

      // console.log('rendering with jsTable');
      // console.log(table)
      // console.log(jsTable)

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
            fill: ["cpu"],
            position: "stacked",
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
            fill: ["cpu"],
            colors: NINETEEN_EIGHTY_FOUR,
            symbol: ["cpu"],
          },
        ],
      };
      plotGraph = <Plot config={lineConfig} />;
      // scatterGraph = <Plot config={scatterConfig} />;
      // plotGraph = <p>Fetched</p>;
      scatterGraph = <p>Help</p>;
      break;
  }

  return (
    <>
      <h2 key="heading-1"> Giraffe Tutorial </h2>, "More text.",
      <h2 key="heading-2"> Another heading </h2>, "Even more text.",
      <div
        style={{
          width: "calc(70vw - 20px)",
          height: "calc(70vh - 20px)",
          margin: "40px",
        }}
      >
        {plotGraph}
      </div>
      , "Even more text.",
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
