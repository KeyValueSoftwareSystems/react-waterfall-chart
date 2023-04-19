import React, { FC, useEffect, useRef, useState } from 'react';
import { IWaterfallGraphProps } from '../types/types';
import { useWaterfallChart } from './utils';
import styles from './styles.module.scss';
import '../index.css';
import { DEFAULT_BAR_WIDTH } from '../constants';

const WaterFallChart: FC<IWaterfallGraphProps> = (props) => {
  const { transactions } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [wrapperHeight, setWrapperHeight] = useState(0);

  useEffect(() => {

    const calculateWrapperHeight = (): void => {
      if (wrapperRef.current) {
        const height = wrapperRef?.current?.offsetHeight;
        setWrapperHeight(height);
      }
    };

    calculateWrapperHeight();

    window.addEventListener('resize', calculateWrapperHeight);

    return () => {
      window.removeEventListener('resize', calculateWrapperHeight);
    };
  }, []);

  const {
    chartElements,
    yAxisUnitsPerPixel,
    yValueForZeroLine,
    yAxisPoints
  } = useWaterfallChart(transactions, wrapperHeight);

  return (
    <div ref={wrapperRef} className={styles.chartWrapper}>
      <svg className={styles.svgContainer}>
        {/* y-axis */}
        <line
          x1='0'
          y1='0'
          x2='0'
          y2='100%'
          className={styles.axisLines}
        />
        {/* x-axis */}
        <line
          x1='0'
          y1='100%'
          x2='100%'
          y2='100%'
          className={styles.axisLines}
        />
        {/* zero line if negative values present */}
        <line
          x1='0'
          y1={yValueForZeroLine}
          x2='100%'
          y2={yValueForZeroLine}
          className={`${styles.axisLines} ${yValueForZeroLine === wrapperHeight && styles.hideLine}`}
        />
        {chartElements?.map((chartElement, index) => (
          <>
            <rect
              key={chartElement?.name}
              width={DEFAULT_BAR_WIDTH}
              height={Math.abs(chartElement?.value / yAxisUnitsPerPixel)}
              y={chartElement?.yVal}
              x={(2 * index + 1) * DEFAULT_BAR_WIDTH}
              className={`${styles.graphBar} ${chartElement?.value >= 0 ? styles.positiveGraph : styles.negativeGraph}`}
            />
            <line
              key={chartElement?.name}
              x1={(2 * index + 2) * DEFAULT_BAR_WIDTH}
              y1={wrapperHeight - chartElement?.cumulativeSum / yAxisUnitsPerPixel - (wrapperHeight - yValueForZeroLine)}
              x2={(2 * index + 3) * DEFAULT_BAR_WIDTH}
              y2={wrapperHeight - chartElement?.cumulativeSum / yAxisUnitsPerPixel - (wrapperHeight - yValueForZeroLine)}
              className={styles.bridgeLine}
            />
          </>
        ))}
      </svg>
      <div className={styles.yPoints}>
        {yAxisPoints?.map((yAxisPoint, index) => (
          <div
            key={yAxisPoint}
            className={styles.yPoint}
            style={{bottom: (index *30) - 8 }}
          >
            {yAxisPoint}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterFallChart;
