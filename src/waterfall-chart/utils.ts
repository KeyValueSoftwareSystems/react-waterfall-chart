import { IChartElement, ITransaction, IUseWaterfallChartReturnType } from "../types/types";

export const useWaterfallChart = (transactions: Array<ITransaction>, chartHeight: number): IUseWaterfallChartReturnType => {
  const largestCumulativeVal = getLargestCumulativeSum(transactions); // this will be the highest y point in the graph
  const smallestCumulativeVal = getSmallestCumulativeSum(transactions);
  // const pixelPerYUnit = 20;
  let cumulativeSum = transactions[0]?.value || 0;
  let chartElements: Array<IChartElement> = [];
  let yAxisUnitsPerPixel = 0;
  let yValueForZeroLine = 0;
  if (chartHeight && chartHeight > 0) {
    yAxisUnitsPerPixel = (largestCumulativeVal - smallestCumulativeVal) / chartHeight;
    yValueForZeroLine = largestCumulativeVal / yAxisUnitsPerPixel;

    chartElements = transactions.map((transaction, index) => {
      const {label, value} = transaction;
      let yVal=0;
      if (value < 0 || index === 0) yVal = chartHeight - ((cumulativeSum) / yAxisUnitsPerPixel) - (chartHeight - yValueForZeroLine);
      else yVal = chartHeight - ((cumulativeSum + value) / yAxisUnitsPerPixel) - (chartHeight - yValueForZeroLine);
      if (index > 0) cumulativeSum += value;
      return ({
        name: label,
        value,
        yVal,
        cumulativeSum
      });
    });
  }
  return({ chartElements, yAxisUnitsPerPixel, yValueForZeroLine});
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
  if(minSum > 0) return 0; // if chart never goes below zero then smallest value will be zero
  return minSum;
}