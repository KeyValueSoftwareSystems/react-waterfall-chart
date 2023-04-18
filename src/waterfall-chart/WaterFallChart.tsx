import React, { FC, useEffect, useRef, useState } from "react";
import { IWaterfallGraphProps } from "../types/types";
import { useWaterfallChart } from  './utils';
import styles from './styles.module.scss';
import '../index.css';
import { DEFAULT_BAR_WIDTH } from "../constants";

const WaterFallChart:FC<IWaterfallGraphProps> = (props) => {
  const { transactions } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [wrapperHeight, setWrapperHeight] = useState(0);

  useEffect(() => {
    // Function to calculate wrapper height
    const calculateWrapperHeight = (): void => {
      if (wrapperRef.current) {
        const height = wrapperRef?.current?.offsetHeight; // Use offsetHeight to get the height
        setWrapperHeight(height); // Update state with calculated height
      }
    };

    calculateWrapperHeight(); // Call the function initially

    // Add event listener for window resize to recalculate wrapper height
    window.addEventListener('resize', calculateWrapperHeight);

    return () => {
      // Cleanup: remove event listener on component unmount
      window.removeEventListener('resize', calculateWrapperHeight);
    };
  }, []);
  const { chartElements, yAxisUnitsPerPixel, yValueForZeroLine } = useWaterfallChart(transactions, wrapperHeight);

  return (
    <div
      ref={wrapperRef}
      className={styles.chartWrapper}
    >
      <svg className={styles.svgContainer}>
        {/* y-axis */}
        <line x1="0" y1="0" x2="0" y2="100%" style={{ strokeDasharray: 1, stroke: 'rgb(158, 158, 158)', strokeWidth: 2}} />
        {/* x-axis */}
        <line x1="0" y1="100%" x2="100%" y2="100%" style={{ strokeDasharray: 1, stroke: 'rgb(158, 158, 158)', strokeWidth: 2}} />
        {yValueForZeroLine > 0 && (
          // zero line if negative values present
          <line
            x1="0"
            y1={yValueForZeroLine}
            x2="100%"
            y2={yValueForZeroLine}
            style={{ strokeDasharray: 1, stroke: 'rgb(158, 158, 158)', strokeWidth: 2}}
          />
        )}
        {chartElements?.map((chartElement, index) => (
          <>
            <rect
              key={chartElement?.name}
              width={DEFAULT_BAR_WIDTH}
              height={Math.abs(chartElement?.value / yAxisUnitsPerPixel)}
              y={chartElement?.yVal}
              x={((2*index)+1) * DEFAULT_BAR_WIDTH}
              style={{
                fill: chartElement?.value > 0 ? '#00B050' : '#FF0000',
                strokeWidth: 2,
                stroke: chartElement?.value > 0 ? '#00B050' : '#FF0000',
                zIndex: 1,
                transition: 'all 0.3s ease-in-out'
              }} />
            <line
              key={chartElement?.name}
              x1={((2*index)+2) * DEFAULT_BAR_WIDTH}
              y1={wrapperHeight - (chartElement?.cumulativeSum / yAxisUnitsPerPixel) - (wrapperHeight - yValueForZeroLine)}
              x2={((2*index)+3) * DEFAULT_BAR_WIDTH}
              y2={wrapperHeight - (chartElement?.cumulativeSum / yAxisUnitsPerPixel) - (wrapperHeight - yValueForZeroLine)}
              style={{
                stroke: '#545453',
                strokeWidth: 2,
                zIndex: 1
              }} />
          </>
        ))}
      </svg>
    </div>
  );
};

export default WaterFallChart;
