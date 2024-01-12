import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { IWaterfallGraphProps } from '../types/types';
import useWaterfallChart from './useWaterFallChart';
import classes from './styles.module.scss';

import {
  DEFAULT_BAR_WIDTH,
  DEFAULT_PIXELS_PER_Y_UNIT,
  DEFAULT_SUMMARY_LABEL,
  FINAL_SUMMARY_GRAPH_KEY,
  FINAL_SUMMARY_X_LABEL_KEY
} from '../constants';

const WaterFallChart: FC<IWaterfallGraphProps> = (props) => {
  const {
    dataPoints,
    barWidth: initialBarWidth = DEFAULT_BAR_WIDTH,
    showBridgeLines = true,
    showYAxisScaleLines = false,
    yAxisPixelsPerUnit: initialYAxisPixelsPerUnit,
    showFinalSummary = true,
    summaryXLabel = DEFAULT_SUMMARY_LABEL,
    styles = {},
    onChartClick,
    onMouseEnter,
    onMouseLeave
  } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [wrapperHeight, setWrapperHeight] = useState(wrapperRef?.current?.offsetHeight || 0);
  const [barWidth, setBarWidth] = useState(initialBarWidth);
  const yAxisPixelsPerUnit = initialYAxisPixelsPerUnit ? initialYAxisPixelsPerUnit : DEFAULT_PIXELS_PER_Y_UNIT;

  const {
    chartElements,
    yValueForZeroLine,
    yAxisPoints,
    yAxisScale,
    calculateBarWidth
  } = useWaterfallChart(
    dataPoints,
    wrapperHeight,
    yAxisPixelsPerUnit,
    showFinalSummary
  );

  useEffect(() => {
    const onWrapperDimensionsChange = (): void => {
      if (wrapperRef.current) {
        setWrapperHeight(wrapperRef?.current?.offsetHeight);
        if (!initialBarWidth || initialBarWidth <= 0) {
          setBarWidth(calculateBarWidth(wrapperRef?.current?.offsetWidth));
        }
      }
    };

    onWrapperDimensionsChange();

    window.addEventListener('resize', onWrapperDimensionsChange);

    return () => window.removeEventListener('resize', onWrapperDimensionsChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBarWidth]);

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
    <div ref={wrapperRef} className={classes.chartWrapper} id='graph-svg-wrapper'>
      <svg className={classes.svgContainer}>
        {/* y-axis */}
        <line x1='0' y1='0' x2='0' y2='100%' className={classes.axisLines} id='yAxisLine' />
        {/* x-axis */}
        <line x1='0' y1='100%' x2='100%' y2='100%' className={classes.axisLines} id='xAxisLine' />
        {/*y axis scale lines */}
        {showYAxisScaleLines && yAxisPoints?.map((yPoint, index) => (
          <line
            key={yPoint}
            x1='0'
            y1={wrapperHeight - index * yAxisPixelsPerUnit}
            x2='100%'
            y2={wrapperHeight - index * yAxisPixelsPerUnit}
            className={`${classes.yAxisScaleLines}`}
            id={`yAxisScaleLine-${index}`}
          />
        ))}
        {chartElements?.map((chartElement, index) => (
          <Fragment key={`${chartElement?.name}-bar-graph`}>
            <rect
              width={barWidth}
              height={chartElement?.barHeight}
              y={chartElement?.yVal}
              x={(2 * index + 1) * barWidth}
              className={`${classes.graphBar} ${
                chartElement?.value >= 0 ? classes.positiveGraph : classes.negativeGraph
              }`}
              style={chartElement?.value >= 0 ? styles?.positiveBar : styles?.negativeBar}
              onClick={(): void => onChartClick && onChartClick(chartElement)}
              onMouseEnter={(e: React.MouseEvent<SVGRectElement, MouseEvent>):void => onMouseEnter && onMouseEnter(e, chartElement)}
              onMouseLeave={(e: React.MouseEvent<SVGRectElement, MouseEvent>):void => onMouseLeave && onMouseLeave(e, chartElement)}
              id={`chartBar-${index}`}
              data-testid={`data-point`}
            />
            {showBridgeLines &&
              (showFinalSummary || index !== chartElements?.length - 1) && (
              <line
                key={`${chartElement?.name}-bridge-line`}
                className={classes.bridgeLine}
                x1={(2 * index + 2) * barWidth}
                y1={yValueForZeroLine - (chartElement?.cumulativeSum / yAxisScale) * yAxisPixelsPerUnit}
                x2={(2 * index + 3) * barWidth}
                y2={yValueForZeroLine - (chartElement?.cumulativeSum / yAxisScale) * yAxisPixelsPerUnit}
                id={`chartBarBridgeLine-${index}`}
              />
            )}
          </Fragment>
        ))}
        {showFinalSummary && summaryBarHeight > 0 && (
          <rect
            key={FINAL_SUMMARY_GRAPH_KEY}
            width={barWidth}
            height={summaryChartElement?.barHeight}
            y={summaryChartElement?.yVal}
            x={(2 * chartElements?.length + 1) * barWidth}
            className={`${classes.graphBar} ${classes.summaryGraphBar}`}
            onClick={(): void => onChartClick && onChartClick(summaryChartElement)}
            id='summaryBar'
            onMouseEnter={(e: React.MouseEvent<SVGRectElement, MouseEvent>):void => onMouseEnter && onMouseEnter(e, summaryChartElement)}
            onMouseLeave={(e: React.MouseEvent<SVGRectElement, MouseEvent>):void => onMouseLeave && onMouseLeave(e, summaryChartElement)}
          />
        )}
      </svg>
      <div className={classes.yPoints}>
        {yAxisPoints?.map((yAxisPoint, index) => (
          <div key={yAxisPoint} className={classes.yPoint} style={{ bottom: index * yAxisPixelsPerUnit - 7 }}>
            {yAxisPoint}
          </div>
        ))}
      </div>
      <div className={classes.xPoints}>
        {dataPoints?.map((transaction, index) => (
          <div
            key={transaction?.label}
            className={classes.xPoint}
            style={{ left: (2 * index + 1.25) * barWidth }}
            // the 1.25 is to reduce chances for the label to overflow to right
          >
            {transaction?.label}
          </div>
        ))}
        {showFinalSummary && (
          <div
            key={FINAL_SUMMARY_X_LABEL_KEY}
            className={classes.xPoint}
            style={{ ...styles?.summaryBar, left: (2 * chartElements?.length + 1.25) * barWidth }}
          >
            {summaryXLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterFallChart;
