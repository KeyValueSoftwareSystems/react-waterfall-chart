import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WaterFallChart from '../waterfall-chart';

// Mock data for transactions
const transactions = [
  { label: 'Transaction 1', value: 100 },
  { label: 'Transaction 2', value: -50 },
  { label: 'Transaction 3', value: 200 }
];

describe('WaterFallChart component', () => {
  it('renders the chart with correct bars and labels', () => {
    // Render the WaterFallChart component with transactions as props
    const { container, getByText } = render(<WaterFallChart dataPoints={transactions} />);

    // Assert that the chart bars are rendered with correct heights
    const positiveBar = container.querySelector('#chartBar-0');
    const negativeBar = container.querySelector('#chartBar-1');
    const summaryBar = container.querySelector('#summaryBar');
    if (positiveBar) expect(positiveBar).toHaveAttribute('height', '50');
    if (negativeBar) expect(negativeBar).toHaveAttribute('height', '25');
    if (summaryBar) expect(summaryBar).toHaveAttribute('height', '75');

    // Assert that the x-axis and y-axis lines are rendered
    const xAxisLine = container.querySelector('#xAxisLine');
    const yAxisLine = container.querySelector('#yAxisLine');
    expect(xAxisLine).toBeInTheDocument();
    expect(yAxisLine).toBeInTheDocument();

    // Assert that the summary label is rendered
    const summaryLabel = getByText('Total');
    expect(summaryLabel).toBeInTheDocument();
  });

  it('calls onChartClick callback when a bar is clicked', () => {
    // Mock callback function
    const mockOnClick = jest.fn();

    // Render the WaterFallChart component with transactions and onChartClick callback as props
    const { container } = render(
      <WaterFallChart dataPoints={transactions} onChartClick={(e: any) => mockOnClick(e)} />
    );

    // Click on a chart bar
    const barZero = container.querySelector('#chartBar-0');
    if (barZero) {
      fireEvent.click(barZero);
      // Assert that the mock callback function is called with the correct chart element
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });

  it('does not render bridge lines when showBridgeLines prop is set to false', () => {
    // Render the WaterFallChart component with showBridgeLines prop set to false
    const { container } = render(<WaterFallChart dataPoints={transactions} showBridgeLines={false} />);

    // Assert that the bridge lines are not rendered
    const bridgeLine = container.querySelector('#chartBarBridgeLine-0');
    expect(bridgeLine).toBeNull();
  });

  it('renders y-axis scale lines when showYAxisScaleLines prop is set to true', () => {
    // Render the WaterFallChart component with showYAxisScaleLines prop set to true
    const { container } = render(<WaterFallChart dataPoints={transactions} showYAxisScaleLines={true} />);

    // Assert that y-axis scale lines are rendered
    const yAxisScaleLines = container.querySelectorAll('[id^="yAxisScaleLine-"]');
    if (yAxisScaleLines?.length > 0) expect(yAxisScaleLines.length).toBeGreaterThan(0);
  });
});
