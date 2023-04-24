import {
  IChartElement,
  IGetIntervalAndYPointsReturnType,
  ITransaction,
  IUseWaterfallChartReturnType
} from '../types/types';

export const useWaterfallChart = (
  transactions: Array<ITransaction>,
  chartHeight: number,
  yAxisPixelsPerUnit: number,
  showFinalSummary: boolean
): IUseWaterfallChartReturnType => {
  const largestCumulativeVal = getLargestCumulativeSum(transactions); // this will be the highest y point in the graph
  const smallestCumulativeVal = getSmallestCumulativeSum(transactions);
  let chartElements: Array<IChartElement> = [];

  const maxLabelsCount = Math.ceil(chartHeight / yAxisPixelsPerUnit);

  let yAxisPoints: Array<number> = [];
  let yAxisScale = 0;
  let lowestYAxisValue = 0;
  let yValueForZeroLine = 0;

  if (chartHeight && chartHeight > 0) {
    const InterValAndYPoints = getIntervalAndYPoints(smallestCumulativeVal, largestCumulativeVal, maxLabelsCount);
    yAxisPoints = InterValAndYPoints?.yAxisPoints;
    yAxisScale = InterValAndYPoints?.yAxisScale;
    lowestYAxisValue = InterValAndYPoints?.yAxisPoints[0];
    // yAxisScale is the number of Y units per 30px
    // lowestYAxisValue is the yAxisValue for origin (0, 0)

    yValueForZeroLine = chartHeight - (Math.abs(lowestYAxisValue) / yAxisScale) * yAxisPixelsPerUnit;
    let cumulativeSum = 0;

    chartElements = transactions.map((transaction) => {
      const { label, value } = transaction;
      let yVal = 0;
      const barHeight = (value / yAxisScale) * yAxisPixelsPerUnit;
      const offsetHeight = (cumulativeSum / yAxisScale) * yAxisPixelsPerUnit;
      // minimum distance from zero line to the floating bar for the transaction
      if (value < 0) {
        yVal = yValueForZeroLine - offsetHeight;
      } else yVal = yValueForZeroLine - (offsetHeight + barHeight);

      cumulativeSum += value;

      return { name: label, value, yVal, cumulativeSum, barHeight: Math.abs(barHeight) };
    });
  }

  const calculateBarWidth = (chartWidth: number): number => {
    let barWidth = 0;
    if (chartWidth && transactions?.length > 0) {
      if (showFinalSummary) barWidth = chartWidth / (2 * transactions?.length + 2);
      else barWidth = chartWidth / (2 * transactions?.length + 1);
    }
    return barWidth;
  };

  return { chartElements, yValueForZeroLine, yAxisPoints, yAxisScale, calculateBarWidth };
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

function roundMinVal(minVal: number, range: number): number {
  return Math.floor(minVal / range) * range;
}

function roundMaxVal(maxVal: number, range: number): number {
  return Math.ceil(maxVal / range) * range;
}

function getIntervalAndYPoints(
  minVal: number,
  maxVal: number,
  maxLabelsCount: number
): IGetIntervalAndYPointsReturnType {
  let yAxisScale = Math.pow(10, Math.ceil(Math.log10((maxVal - minVal) / maxLabelsCount)) - 1);
  let roundedMinVal = roundMinVal(minVal, yAxisScale);
  const roundedMaxVal = roundMaxVal(maxVal, yAxisScale);
  let isScaleSufficient = checkIfScaleSufficient(yAxisScale, maxLabelsCount, roundedMaxVal - roundedMinVal);

  let isMultipleOfFiveChecked = false;
  while (!isScaleSufficient) {
    if (isMultipleOfFiveChecked) {
      yAxisScale *= 2;
      isMultipleOfFiveChecked = false;
    } else {
      yAxisScale = yAxisScale * 5;
      isMultipleOfFiveChecked = true;
    }
    roundedMinVal = roundMinVal(minVal, yAxisScale);
    isScaleSufficient = checkIfScaleSufficient(yAxisScale, maxLabelsCount, maxVal - roundedMinVal);
  }

  const yAxisPoints = [];
  for (let i = 0; i < maxLabelsCount; i++) {
    const yPoint = roundedMinVal + i * yAxisScale;
    yAxisPoints.push(yPoint);
  }

  return { yAxisScale, yAxisPoints };
}

function checkIfScaleSufficient(scale: number, maxLabelsCount: number, valueRange: number): boolean {
  if (maxLabelsCount === 0) return true; // to stop the while loop from checking for sufficient scale with zero maxLabelsCount
  if (scale * maxLabelsCount >= valueRange) return true;
  return false;
}
