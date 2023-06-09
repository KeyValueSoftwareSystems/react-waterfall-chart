import { CSSProperties } from 'react';

export type IWaterfallGraphProps = {
  transactions: Array<ITransaction>;
  barWidth?: number;
  showBridgeLines?: boolean;
  showYAxisScaleLines?: boolean;
  yAxisPixelsPerUnit?: number;
  showFinalSummary?: boolean;
  summaryXLabel?: string;
  styles?: ICustomizationStyles;
  onChartClick?: IOnChartClick;
};

export type ICustomizationStyles = {
  summaryBar?: CSSProperties;
  positiveBar?: CSSProperties;
  negativeBar?: CSSProperties;
};

export type ITransaction = {
  label: string;
  value: number;
};

export type IChartElement = {
  name: string;
  value: number;
  yVal: number;
  cumulativeSum: number;
  barHeight: number;
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

export type IOnChartClick = (chartElement: IChartElement) => void;

export enum chartTypes {
  transaction,
  summary
}
