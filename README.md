# React Waterfall Chart

  

<a  href="https://www.npmjs.com/package/@keyvaluesystems/react-waterfall-chart"><img  src="https://badgen.net/npm/v/@keyvaluesystems/react-waterfall-chart?color=blue"  alt="npm version"></a>  <a  href="https://www.npmjs.com/package/@keyvaluesystems/react-waterfall-chart"  ><img  src="https://img.shields.io/npm/dw/@keyvaluesystems/react-waterfall-chart?label=Downloads"  /></a>  <a  href="https://github.com/KeyValueSoftwareSystems/react-waterfall-chart"><img  src="https://github.com/KeyValueSoftwareSystems/react-waterfall-chart/actions/workflows/deploy.yml/badge.svg"  alt=""  /></a>

  

<div  align="center">
<img  src="./src/assets/waterfall-chart-example.png"  alt=""  width="784"  height="414"/>
</div>

  

>A customizable & responsive Waterfall chart for React project

  

Try tweaking a waterfall chart using this codesandbox link <a  href="https://codesandbox.io/p/sandbox/react-water-fall-chart-nxkyrt">here</a>

  

## Installation

  

The easiest way to use react-waterfall-chart is to install it from npm and build it into your app with Webpack.

  

```bash

npm install  @keyvaluesystems/react-waterfall-chart

```

You’ll need to install React separately since it isn't included in the package.  

## Usage

React Waterfall chart can run in a very basic mode by just providing the `dataPoints` like given below:

  

```jsx

import  WaterfallChart  from  '@keyvaluesystems/react-waterfall-chart';

<WaterfallChart
  dataPoints={dataPoints}
/>

```

  

The dataPoints prop is an array of dataPoint with the following keys:

  

-  `label` - a string to represent each dataPoint

-  `value` - a number that specifies the dataPoint quantity

An example for dataPoint array is shown below:

  

```jsx
const  dataPoints = [{
    label:  'Quarter 1, 2020',
    value:  1000
  },{
    label:  'Quarter 2, 2020',
    value:  -500
  }];
```

You can use `barWidth` prop to specify the width of each bar present in the chart. The given value will be converted to pixels (px) and applied to the chart.
With the help of `showBridgeLines` prop, the line connecting the adjacent bars can be shown/hidden.
`showFinalSummary` can be used to display the summary as the last bar.
 
```jsx
<WaterfallChart
  dataPoints={dataPoints}
  barWidth={100}
  showBridgeLines={true}
  showFinalSummary={false}
/>
```

  

You can specify whether to show or hide the scale lines in the Y axis with the help of `showYAxisScaleLines` prop.

```jsx
<WaterfallChart
  dataPoints={dataPoints}
  showYAxisScaleLines={true}
/>
```
## Props

  Props that can be passed to the component are listed below:

<table>
<thead>
<tr>
<th>Prop</th>
<th>Description</th>
<th>Default</th>
</tr>
</thead>
<tbody>
<tr>
<td><code><b>dataPoints:</b> object[]</code></td>
<td>
An array of dataPoint objects to specifying the value and label
</td>
<td><code>[]</code></td>
</tr>
<tr>
<td><code><b>barWidth?:</b> number</code></td>
<td>
A number to specify the width of each bars shown in the chart
</td>
<td><code>true</code></td>
</tr>
<tr>
<td><code><b>showBridgeLines?:</b> number</code></td>
<td>
A boolean value to specify whether to show the connecting line between adjacent bars
</td>
<td><code>true</code></td>
</tr>
<tr>
<td><code><b>showYAxisScaleLines?:</b> boolean</code></td>
<td>
The boolean value to control the display of scale lines in y axis
</td>
<td><code>true</code></td>
</tr>
<tr>
<td><code><b>yAxisPixelsPerUnit?:</b> number</code></td>
<td>
The distance between each y axis scale unit. The value specified will be applied as pixels.
</td>
<td><code>0</code></td>
</tr>
<tr>
<td><code><b>showFinalSummary?:</b> boolean</code></td>
<td>
The boolean value to control the display of summary section. The summary will be displayed as the last bar
</td>
<td><code>true</code></td>
</tr>
<tr>
<td><code><b>summaryXLabel?:</b> string</code></td>
<td>
The x axis label to be shown for the summary section.
</td>
<td><code>Summary</code></td>
</tr>
<tr>
<td><code><b>onMouseEnter?:</b> function</code></td>
<td>
The callback function which will be triggered on mouse entering the bars in the waterfall chart. The mouse event and current bar element will be passed as the prop in the function
</td>
<td><code>undefined</code></td>
<tr>
<td><code><b>onMouseLeave?:</b> function</code></td>
<td>
The callback function which will be triggered on mouse leaving the bars in the waterfall chart. The mouse event and current bar element will be passed as the prop in the function
</td>
<td><code>undefined</code></td>
</tr>
<tr>
<td><code><b>onChartClick?:</b> function</code></td>
<td>
The callback function which will be triggered on clicking the bars in the waterfall chart. The current bar element will be passed as the prop in the function
</td>
<td><code>undefined</code></td>
</tr>
<tr>
<td><code><b>styles?:</b> object</code></td>
<td>
Provides you with a bunch of callback functions to override the default styles.
</td>
<td><code>undefined</code></td>
</tr>
</tbody>
</table>


## Style Customizations


All the default styles provided by this package are overridable using the `style` prop.
the below code shows all the overridable styles:

```jsx
<WaterfallChart
 dataPoints={dataPoints}
 showYAxisScaleLines={true}
 styles={{
  summaryBar: CSSProperties,
  positiveBar: CSSProperties,
  negativeBar: CSSProperties
 }}
/>
```
-  `summaryBar` - overrides the summary bar styles
-  `positiveBar` - overrides the positive value bar styles
-  `negativeBar` - overrides the negative value bar styles
