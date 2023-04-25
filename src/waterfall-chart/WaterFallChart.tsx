import React, { FC, useEffect, useRef, useState } from 'react';
import { IWaterfallGraphProps } from '../types/types';
import useWaterfallChart from './useWaterFallChart';
import styles from './styles.module.scss';

import {
  DEFAULT_BAR_WIDTH,
  DEFAULT_PIXELS_PER_Y_UNIT,
  DEFAULT_SUMMARY_LABEL,
  FINAL_SUMMARY_GRAPH_KEY,
  FINAL_SUMMARY_X_LABEL_KEY
} from '../constants';

const WaterFallChart: FC<IWaterfallGraphProps> = (props) => {
  const {
    transactions,
    barWidth,
    showBridgeLines = true,
    showYAxisScaleLines = false,
    yAxisPixelsPerUnit = DEFAULT_PIXELS_PER_Y_UNIT,
    showFinalSummary = true,
    summaryXLabel = DEFAULT_SUMMARY_LABEL,
    summaryBarStyles = {},
    positiveBarStyles = {},
    negativeBarStyles = {},
    onChartClick
  } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [barWidthVal, setBarWidthVal] = useState(barWidth ?? DEFAULT_BAR_WIDTH);

  const { chartElements, yValueForZeroLine, yAxisPoints, yAxisScale, calculateBarWidth } = useWaterfallChart(
    transactions,
    wrapperHeight,
    yAxisPixelsPerUnit,
    showFinalSummary
  );

  useEffect(() => {
    const onWrapperDimensionsChange = (): void => {
      if (wrapperRef.current) {
        setWrapperHeight(wrapperRef?.current?.offsetHeight);
        if (!barWidth || barWidth <= 0) setBarWidthVal(calculateBarWidth(wrapperRef?.current?.offsetWidth));
      }
    };

    onWrapperDimensionsChange();

    window.addEventListener('resize', onWrapperDimensionsChange);

    return () => window.removeEventListener('resize', onWrapperDimensionsChange);
  }, [barWidth, calculateBarWidth]);

  const summaryValue = Math.abs(chartElements[chartElements?.length - 1]?.cumulativeSum);
  const summaryBarHeight = Math.abs((summaryValue / yAxisScale) * yAxisPixelsPerUnit);
  const summaryChartElement = {
    name: summaryXLabel,
    value: summaryValue,
    yVal: yValueForZeroLine - (summaryValue / yAxisScale) * yAxisPixelsPerUnit,
    cumulativeSum: 0,
    barHeight: summaryBarHeight
  };

  return (
    <div ref={wrapperRef} className={styles.chartWrapper}>
      <svg className={styles.svgContainer}>
        {/* y-axis */}
        <line x1='0' y1='0' x2='0' y2='100%' className={styles.axisLines} id='yAxisLine' />
        {/* x-axis */}
        <line x1='0' y1='100%' x2='100%' y2='100%' className={styles.axisLines} id='xAxisLine' />
        {/*y axis scale lines */}
        {showYAxisScaleLines && yAxisPoints?.map((yPoint, index) => (
          <line
            key={yPoint}
            x1='0'
            y1={wrapperHeight - index * yAxisPixelsPerUnit}
            x2='100%'
            y2={wrapperHeight - index * yAxisPixelsPerUnit}
            className={`${styles.yAxisScaleLines}`}
            id={`yAxisScaleLine-${index}`}
          />
        ))}
        {chartElements?.map((chartElement, index) => (
          <>
            <rect
              key={`${chartElement?.name}-bar-graph`}
              width={barWidthVal}
              height={chartElement?.barHeight}
              y={chartElement?.yVal}
              x={(2 * index + 1) * barWidthVal}
              className={`${styles.graphBar} ${chartElement?.value >= 0 ? styles.positiveGraph : styles.negativeGraph}`}
              style={chartElement?.value >= 0 ? positiveBarStyles : negativeBarStyles}
              onClick={(): void => onChartClick && onChartClick(chartElement)}
              id={`chartBar-${index}`}
            />
            {showBridgeLines && (showFinalSummary || index !== chartElements?.length - 1) && (
              <line
                key={`${chartElement?.name}-bridge-line`}
                className={styles.bridgeLine}
                x1={(2 * index + 2) * barWidthVal}
                y1={yValueForZeroLine - (chartElement?.cumulativeSum / yAxisScale) * yAxisPixelsPerUnit}
                x2={(2 * index + 3) * barWidthVal}
                y2={yValueForZeroLine - (chartElement?.cumulativeSum / yAxisScale) * yAxisPixelsPerUnit}
                id={`chartBarBridgeLine-${index}`}
              />
            )}
          </>
        ))}
        {showFinalSummary && summaryBarHeight > 0 && (
          <rect
            key={FINAL_SUMMARY_GRAPH_KEY}
            width={barWidthVal}
            height={summaryChartElement?.barHeight}
            y={summaryChartElement?.yVal}
            x={(2 * chartElements?.length + 1) * barWidthVal}
            className={`${styles.graphBar} ${styles.summaryGraphBar}`}
            onClick={(): void => onChartClick && onChartClick(summaryChartElement)}
            id="summaryBar"
          />
        )}
      </svg>
      <div className={styles.yPoints}>
        {yAxisPoints?.map((yAxisPoint, index) => (
          <div
            key={yAxisPoint}
            className={styles.yPoint}
            style={{ bottom: index * yAxisPixelsPerUnit - 7 }}
          >
            {yAxisPoint}
          </div>
        ))}
      </div>
      <div className={styles.xPoints}>
        {transactions?.map((transaction, index) => (
          <div
            key={transaction?.label}
            className={styles.xPoint}
            style={{ left: (2 * index + 1.25) * barWidthVal }}
            // the 1.25 is to reduce chances for the label to overflow to right
          >
            {transaction?.label}
          </div>
        ))}
        {showFinalSummary && (
          <div
            key={FINAL_SUMMARY_X_LABEL_KEY}
            className={styles.xPoint}
            style={{ ...summaryBarStyles, left: (2 * chartElements?.length + 1.25) * barWidthVal }}
          >
            {summaryXLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterFallChart;
