# Giraffe
This is a simple web app that uses [Giraffe](https://github.com/influxdata/giraffe/blob/master/README.md), InfluxData's visualization library, to create two time series plots. 

## Getting Started [](#getting-started)

#### Installation

Install [Giraffe](https://www.npmjs.com/package/@influxdata/giraffe) with your package manager

`yarn add @influxdata/giraffe` or `npm install @influxdata/giraffe`

#### Example

1. In your React code, import the `Plot` component and the `newTable` utility function

  <pre>
  import {Plot, newTable} from '@influxdata/giraffe'
  </pre>

#### Run 
If using yarn: 
<pre>
cd my-app
yarn start
</pre>
If using npm
<pre>
cd my-app
npm start
</pre>


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).