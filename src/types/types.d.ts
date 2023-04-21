export type IWaterfallGraphProps = {
  transactions: Array<ITransaction>;
  barWidth?: number;
};

export type ITransaction = {
  label: string;
  value: number;
  color?: string;
};

export type IChartElement = {
  name: string;
  value: number;
  yVal: number;
  cumulativeSum: number;
};

export type IUseWaterfallChartReturnType = {
  chartElements: Array<IChartElement>;
  yValueForZeroLine: number;
  yAxisPoints: Array<number>;
  yAxisScale: number;
  calculateBarWidth: ICalculateBarWidth;
};

export type IGetIntervalAndYPointsReturnType = {
  yAxisScale: number;
  yAxisPoints: Array<number>;
};

export type ICalculateBarWidth = (graphWidth: number) => number;
