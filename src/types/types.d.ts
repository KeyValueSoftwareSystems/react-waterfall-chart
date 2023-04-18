export type IWaterfallGraphProps = {
  transactions: Array<ITransaction>;
}

export type ITransaction = {
  label: string;
  value: number;
  color?: string;
}

export type IChartElement = {
  name: string;
  value: number;
  yVal: number;
  cumulativeSum: number;
}
export type IUseWaterfallChartReturnType = {
  chartElements: Array<IChartElement>;
  yAxisUnitsPerPixel: number;
  yValueForZeroLine: number
}