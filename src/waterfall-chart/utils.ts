import {
  IGetIntervalAndYPointsReturnType,
  ITransaction
} from '../types/types';

export function getLargestCumulativeSum(arr: Array<ITransaction>): number {
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

export function getSmallestCumulativeSum(arr: Array<ITransaction>): number {
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

export function roundMinVal(minVal: number, range: number): number {
  return Math.floor(minVal / range) * range;
}

function roundMaxVal(maxVal: number, range: number): number {
  return Math.ceil(maxVal / range) * range;
}

export function getIntervalAndYPoints(
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

export function checkIfScaleSufficient(scale: number, maxLabelsCount: number, valueRange: number): boolean {
  if (maxLabelsCount === 0) return true; // to stop the while loop from checking for sufficient scale with zero maxLabelsCount
  if (scale * maxLabelsCount >= valueRange) return true;
  return false;
}
