import { IChartElement, ITransaction, IUseWaterfallChartReturnType } from '../types/types';

export const useWaterfallChart = (
  transactions: Array<ITransaction>,
  chartHeight: number
): IUseWaterfallChartReturnType => {
  const largestCumulativeVal = getLargestCumulativeSum(transactions); // this will be the highest y point in the graph
  const smallestCumulativeVal = getSmallestCumulativeSum(transactions);
  let cumulativeSum = transactions[0]?.value || 0;
  let chartElements: Array<IChartElement> = [];
  let yAxisUnitsPerPixel = 0;
  let yValueForZeroLine = 0;
  if (chartHeight && chartHeight > 0) {
    yAxisUnitsPerPixel = (largestCumulativeVal - smallestCumulativeVal) / chartHeight;
    yValueForZeroLine = largestCumulativeVal / yAxisUnitsPerPixel;

    chartElements = transactions.map((transaction, index) => {
      const { label, value } = transaction;
      let yVal = 0;
      if (value < 0 || index === 0)
        yVal = chartHeight - cumulativeSum / yAxisUnitsPerPixel - (chartHeight - yValueForZeroLine);
      else yVal = chartHeight - (cumulativeSum + value) / yAxisUnitsPerPixel - (chartHeight - yValueForZeroLine);
      if (index > 0) cumulativeSum += value;
      return {
        name: label,
        value,
        yVal,
        cumulativeSum
      };
    });
  }
  const yAxisInterval = getAppropriateIntervals(smallestCumulativeVal, largestCumulativeVal, chartHeight);
  const yAxisPoints = generateYPoints(smallestCumulativeVal, largestCumulativeVal, yAxisInterval);

  return { chartElements, yAxisUnitsPerPixel, yValueForZeroLine, yAxisPoints };
};

function getLargestCumulativeSum(arr: Array<ITransaction>): number {
  let maxSum = arr[0]?.value; // Initialize maxSum and currentSum with the first element of the array
  let currentSum = arr[0]?.value;

  for (let i = 1; i < arr.length; i++) {
    currentSum += arr[i]?.value;
    if (currentSum > maxSum) {
      maxSum = currentSum;
    }
  }
  return maxSum;
}

function getSmallestCumulativeSum(arr: Array<ITransaction>): number {
  let minSum = arr[0]?.value; // Initialize minSum and currentSum with the first element of the array
  let currentSum = arr[0]?.value;

  for (let i = 1; i < arr.length; i++) {
    currentSum += arr[i]?.value;
    if (currentSum < minSum) {
      minSum = currentSum;
    }
  }

  if (minSum > 0) return 0; // if chart never goes below zero then smallest value should be zero
  return minSum;
}


function generateYPoints(minVal: number, maxVal: number, interval: number): Array<number> {
  const yPoints = [];
  for (let yPoint = minVal; yPoint <= maxVal; yPoint += interval) {
    yPoints.push(Math.round(yPoint));
  }
  return yPoints;
}


function getAppropriateIntervals(minVal: number, maxVal: number, chartHeight: number): number {

  const range = maxVal - minVal;

  let interval = 1;
  if (range > 0) {
  // Calculate the order of magnitude of the range
    const orderOfMagnitude = Math.floor(Math.log10(range));

    // Set the interval based on the order of magnitude
    interval = Math.pow(10, orderOfMagnitude - 1);
  }


  // Desired distance between two yAxis labels (in pixels)
  const desiredDistance = 30;

  // Limit the number of yAxis labels based on available height and desired distance
  const maxLabels = Math.floor(chartHeight / desiredDistance);

  // Calculate the interval by rounding up to the nearest multiple of maxLabels
  interval = Math.ceil(interval / maxLabels) * maxLabels;

  return interval;
}