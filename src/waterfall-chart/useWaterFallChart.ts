import { IChartElement, ITransaction, IUseWaterfallChartReturnType } from '../types/types';
import { getIntervalAndYPoints, getLargestCumulativeSum, getSmallestCumulativeSum } from './utils';

const useWaterfallChart = (
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

export default useWaterfallChart;
