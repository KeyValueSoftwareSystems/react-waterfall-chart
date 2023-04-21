import React, { FC, useEffect, useRef, useState } from 'react';
import { IWaterfallGraphProps } from '../types/types';
import { useWaterfallChart } from './utils';
import styles from './styles.module.scss';
import '../index.css';
import { DEFAULT_BAR_WIDTH, DEFAULT_PIXELS_PER_Y_UNIT } from '../constants';

const WaterFallChart: FC<IWaterfallGraphProps> = (props) => {
  const { transactions, barWidth } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [barWidthVal, setBarWidthVal] = useState(barWidth ?? DEFAULT_BAR_WIDTH);

  const { chartElements, yValueForZeroLine, yAxisPoints, yAxisScale, calculateBarWidth } = useWaterfallChart(
    transactions,
    wrapperHeight
  );

  useEffect(() => {
    const onWrapperDimensionsChange = (): void => {
      if (wrapperRef.current) {
        setWrapperHeight(wrapperRef?.current?.offsetHeight);
        if (!barWidth) setBarWidthVal(calculateBarWidth(wrapperRef?.current?.offsetWidth));
      }
    };

    onWrapperDimensionsChange();

    window.addEventListener('resize', onWrapperDimensionsChange);

    return () => window.removeEventListener('resize', onWrapperDimensionsChange);
  }, [barWidth, calculateBarWidth]);

  return (
    <div ref={wrapperRef} className={styles.chartWrapper}>
      <svg className={styles.svgContainer}>
        {/* y-axis */}
        <line x1='0' y1='0' x2='0' y2='100%' className={styles.axisLines} />
        {/* x-axis */}
        <line x1='0' y1='100%' x2='100%' y2='100%' className={styles.axisLines} />
        {/* zero line if negative values present */}
        {yAxisPoints?.map((yPoint, index) => (
          <line
            key={yPoint}
            x1='0'
            y1={wrapperHeight - index * DEFAULT_PIXELS_PER_Y_UNIT}
            x2='100%'
            y2={wrapperHeight - index * DEFAULT_PIXELS_PER_Y_UNIT}
            className={`${styles.axisLines}`}
          />
        ))}
        {chartElements?.map((chartElement, index) => (
          <>
            <rect
              key={chartElement?.name}
              width={barWidthVal}
              height={(Math.abs(chartElement?.value) / yAxisScale) * DEFAULT_PIXELS_PER_Y_UNIT}
              y={chartElement?.yVal}
              x={(2 * index + 1) * barWidthVal}
              className={`${styles.graphBar} ${chartElement?.value >= 0 ? styles.positiveGraph : styles.negativeGraph}`}
            />
            <line
              key={chartElement?.name}
              x1={(2 * index + 2) * barWidthVal}
              y1={
                wrapperHeight -
                (chartElement?.cumulativeSum / yAxisScale) * DEFAULT_PIXELS_PER_Y_UNIT -
                (wrapperHeight - yValueForZeroLine)
              }
              x2={(2 * index + 3) * barWidthVal}
              y2={
                wrapperHeight -
                (chartElement?.cumulativeSum / yAxisScale) * DEFAULT_PIXELS_PER_Y_UNIT -
                (wrapperHeight - yValueForZeroLine)
              }
              className={styles.bridgeLine}
            />
          </>
        ))}
      </svg>
      <div className={styles.yPoints}>
        {yAxisPoints?.map((yAxisPoint, index) => (
          <div key={yAxisPoint} className={styles.yPoint} style={{ bottom: index * DEFAULT_PIXELS_PER_Y_UNIT - 8 }}>
            {yAxisPoint}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterFallChart;
