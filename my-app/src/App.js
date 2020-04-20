import React from 'react';
import logo from './logo.svg';
import './App.css';
import { InfluxDB, FluxTableMetaData } from '@influxdata/influxdb-client'
import { Plot, newTable, timeFormatter, NINETEEN_EIGHTY_FOUR} from '@influxdata/giraffe';

const now = Date.now()
const numberOfRecords = 80
const recordsPerLine = 40
const maxValue = 100

const TIME_COL = []
const VALUE_COL = []
const CPU_COL = []

function getRandomNumber(max) {
  return Math.random() * Math.floor(max)
}
for (let i = 0; i < numberOfRecords; i += 1) {
  VALUE_COL.push(getRandomNumber(maxValue))
  CPU_COL.push(`cpu${Math.floor(i / recordsPerLine)}`)
  TIME_COL.push(now + (i % recordsPerLine) * 1000 * 60)
}

const valueAxisLabel = "bytes"

const table = newTable(numberOfRecords)
  .addColumn('_time', 'time', TIME_COL)
  .addColumn('_value', 'number', VALUE_COL)
  .addColumn('cpu', 'string', CPU_COL)

console.log(table)

const plot = () => {
  const config = {
    table,
    valueFormatters: {
      _time: timeFormatter({timeFormat:"UTC", format: "HH:mm"}),
      _value: val =>
        `${val.toFixed(2)}${
          valueAxisLabel ? ` ${valueAxisLabel}` : valueAxisLabel
        }`,
    },
    // xscale and yscale turned into linear other options include log
    xScale: "linear",
    yScale: "linear",
    // font for ticks and such 
    legendFont:"12px sans-serif",
    tickFont: "12px sans-serif",
    // showAxes 
    showAxes: true,
    layers: [
      {
        type: 'line',
        //x
        x: "_time",
        //y
        y: "_value",
        fill: ["cpu"],
        position: "stacked",
        interpolation: 'monotoneX',
        colors: NINETEEN_EIGHTY_FOUR,
        lineWidth: 1,
        hoverDimension: 'auto',
        shadeBelow: true,
        shadeBelowOpacity: 0.1,
      },

    ],
  }
  console.log("config", config)
  return (
    <div
      style={{
      width: 'calc(100vw - 100px)',
      height: 'calc(100vh - 100px)',
      margin: '50px',
    }}
    >
    <Plot config = {config} />
    </div>
  )
};


export {plot}; 
