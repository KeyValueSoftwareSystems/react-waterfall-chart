import { IChartElement, IDataPoint, IUseWaterfallChartReturnType } from '../types/types';
import { getIntervalAndYPoints, getLargestCumulativeSum, getSmallestCumulativeSum } from './utils';

const useWaterfallChart = (
  dataPoints: Array<IDataPoint>,
  chartHeight: number,
  yAxisPixelsPerUnit: number,
  showFinalSummary: boolean
): IUseWaterfallChartReturnType => {
  if (chartHeight <= 0) {
    return {
      chartElements: [],
      yValueForZeroLine: 0,
      yAxisPoints: [],
      yAxisScale: 0,
      calculateBarWidth: () => 0
    };
  }

  const largestCumulativeVal = getLargestCumulativeSum(dataPoints);
  const smallestCumulativeVal = getSmallestCumulativeSum(dataPoints);

  const { yAxisPoints, yAxisScale } = getIntervalAndYPoints(smallestCumulativeVal, largestCumulativeVal, Math.ceil(chartHeight / yAxisPixelsPerUnit));
  const lowestYAxisValue = yAxisPoints[0];
  const yValueForZeroLine = chartHeight - (Math.abs(lowestYAxisValue) / yAxisScale) * yAxisPixelsPerUnit;

  let cumulativeSum = 0;
  const chartElements: Array<IChartElement> = dataPoints.map((dataPoint) => {
    const { label, value } = dataPoint;
    const barHeight = (value / yAxisScale) * yAxisPixelsPerUnit;
    const offsetHeight = (cumulativeSum / yAxisScale) * yAxisPixelsPerUnit;
    const yVal = value < 0 ? yValueForZeroLine - offsetHeight : yValueForZeroLine - (offsetHeight + barHeight);

    cumulativeSum += value;

    return { name: label, value, yVal, cumulativeSum, barHeight: Math.abs(barHeight) };
  });

  const calculateBarWidth = (chartWidth: number): number => {
    if (chartWidth <= 0 || dataPoints.length === 0) {
      return 0;
    }

    const divisor = showFinalSummary ? 2 * dataPoints.length + 2 : 2 * dataPoints.length + 1;
    return chartWidth / divisor;
  };

  return { chartElements, yValueForZeroLine, yAxisPoints, yAxisScale, calculateBarWidth };
};

export default useWaterfallChart;
