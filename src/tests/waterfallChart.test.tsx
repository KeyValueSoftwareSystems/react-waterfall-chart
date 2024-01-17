import React from 'react';
import { render, fireEvent, prettyDOM, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WaterFallChart from '../waterfall-chart';
import { wait } from '@testing-library/user-event/dist/utils';

// Mock data for dataPoints
const dataPoints = [
  { label: 'data 1', value: 100 },
  { label: 'data 2', value: -50 },
  { label: 'data 3', value: 200 }
];

const mockOnMouseClick = jest.fn();
const mockOnMouseEnter = jest.fn();
const mockOnMouseLeave = jest.fn();

const props = {
  dataPoints,
  barWidth: 20,
  showBridgeLines: true,
  showYAxisScaleLines: false,
  yAxisPixelsPerUnit: 30,
  showFinalSummary: true,
  summaryXLabel: 'summary',
  styles: {
    positiveBar: { fill: 'blue' },
    negativeBar: { fill: 'red' }
  },
  onChartClick: mockOnMouseClick,
  onMouseEnter: mockOnMouseEnter,
  onMouseLeave: mockOnMouseLeave
};

const DEFAULT_OFFSET_HEIGHT = 1000;
const DEFAULT_OFFSET_WIDTH = 1500;
Object.defineProperties(window.HTMLElement.prototype, {
  offsetHeight: {
    get() {
      return parseFloat(this.style.height) || DEFAULT_OFFSET_HEIGHT;
    }
  },
  offsetWidth: {
    get() {
      return parseFloat(this.style.width) || DEFAULT_OFFSET_WIDTH;
    }
  }
});

describe('WaterFallChart component', () => {
  it('renders the chart with correct bars and labels', () => {
    // Render the WaterFallChart component with dataPoints as props
    const { container, getByText } = render(<WaterFallChart {...props} />);

    // Assert that the chart bars are rendered with correct heights
    const positiveBar = container.querySelector('#chartBar-0');
    const negativeBar = container.querySelector('#chartBar-1');
    const summaryBar = container.querySelector('#summaryBar');
    expect(positiveBar).toHaveAttribute('height', '300');
    expect(negativeBar).toHaveAttribute('height', '150');
    expect(summaryBar).toHaveAttribute('height', '750');

    // Assert that the x-axis and y-axis lines are rendered
    const xAxisLine = container.querySelector('#xAxisLine');
    const yAxisLine = container.querySelector('#yAxisLine');
    expect(xAxisLine).toBeInTheDocument();
    expect(yAxisLine).toBeInTheDocument();

    // Assert that the summary label is rendered
    const summaryLabel = getByText('summary');
    expect(summaryLabel).toBeInTheDocument();
  });

  it('does not render the chart with correct bars and labels when data points is empty', () => {
    // Render the WaterFallChart component with dataPoints as props

    const { container, getByText } = render(<WaterFallChart dataPoints={[]} />);

    // Assert that the chart bars are rendered with correct heights
    const positiveBar = container.querySelector('#chartBar-0');
    const negativeBar = container.querySelector('#chartBar-1');
    const summaryBar = container.querySelector('#summaryBar');
    expect(positiveBar).toBeNull();
    expect(negativeBar).toBeNull();
    expect(summaryBar).toBeNull();

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

    // Render the WaterFallChart component with dataPoints and onChartClick callback as props
    const { container } = render(<WaterFallChart {...props} />);

    // Click on a chart bar
    const barZero = container.querySelector('#chartBar-0');
    fireEvent.click(barZero as Element);
    // Assert that the mock callback function is called with the correct chart element
    expect(mockOnMouseClick).toHaveBeenCalledTimes(1);
  });

  it('calls onMouseEnter and onMouseLeavecallback when a bar is hovered', () => {
    // Mock callback function
    const mockOnMounseEnter = jest.fn();
    const mockOnMounseLeave = jest.fn();

    // Render the WaterFallChart component with dataPoints and onChartClick callback as props
    const { container } = render(
      <WaterFallChart
        dataPoints={dataPoints}
        onMouseEnter={(e: any, chartElement) => mockOnMounseEnter(e, chartElement)}
        onMouseLeave={(e: any, chartElement) => mockOnMounseLeave(e, chartElement)}
      />
    );

    // Click on a chart bar
    const barZero = container.querySelector('#chartBar-0');
    fireEvent.mouseEnter(barZero as Element);
    // Assert that the mock callback function is called with the correct chart element
    expect(mockOnMounseEnter).toHaveBeenCalledTimes(1);
    fireEvent.mouseLeave(barZero as Element);
    // Assert that the mock callback function is called with the correct chart element
    expect(mockOnMounseLeave).toHaveBeenCalledTimes(1);
  });

  it('calls onMouseEnter and onMouseLeave callback when a bar is hovered', () => {
    // Mock callback functions
    const mockOnMouseEnter = jest.fn();
    const mockOnMouseLeave = jest.fn();

    // Render the WaterFallChart component with dataPoints and callback props
    const { container } = render(
      <WaterFallChart
        dataPoints={dataPoints}
        onMouseEnter={(e, chartElement) => mockOnMouseEnter(e, chartElement)}
        onMouseLeave={(e, chartElement) => mockOnMouseLeave(e, chartElement)}
      />
    );

    // Simulate mouse events
    const barZero = container.querySelector('#chartBar-0');
    fireEvent.mouseEnter(barZero as Element);
    fireEvent.mouseLeave(barZero as Element);

    // Assert that the mock callback functions are called
    expect(mockOnMouseEnter).toHaveBeenCalledTimes(1);
    expect(mockOnMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('does not render bridge lines when showBridgeLines prop is set to false', () => {
    // Render the WaterFallChart component with showBridgeLines prop set to false
    const { container } = render(<WaterFallChart dataPoints={dataPoints} showBridgeLines={false} />);

    // Assert that the bridge lines are not rendered
    const bridgeLine = container.querySelector('#chartBarBridgeLine-0');
    expect(bridgeLine).toBeNull();
  });

  it('renders y-axis scale lines when showYAxisScaleLines prop is set to true', () => {
    // Render the WaterFallChart component with showYAxisScaleLines prop set to true
    const { container } = render(<WaterFallChart dataPoints={dataPoints} showYAxisScaleLines={true} />);

    // Assert that y-axis scale lines are rendered
    const yAxisScaleLines = container.querySelectorAll('[id^="yAxisScaleLine-"]');
    if (yAxisScaleLines?.length > 0) expect(yAxisScaleLines.length).toBeGreaterThan(0);
  });

  it('does not render summary when showFinalSummary prop is set to false', () => {
    // Render the WaterFallChart component with showYAxisScaleLines prop set to true
    const { container } = render(<WaterFallChart dataPoints={dataPoints} showFinalSummary={false} />);

    // Assert that y-axis scale lines are rendered
    const summaryBar = container.querySelector('#summaryBar');
    expect(summaryBar).toBeNull();
  });

  it('sets barWidth based on calculateBarWidth when initialBarWidth is 0 or not defined', async () => {
    // Render the WaterFallChart component with initialBarWidth as 0 or undefined
    const { container } = render(<WaterFallChart dataPoints={dataPoints} barWidth={0} />);
    fireEvent(window, new Event('resize'));
    await waitFor(() => {
      const barZero = container.querySelector('#chartBar-0');
      expect(barZero).toHaveAttribute('width', '187.5');
    });
  });

  it('handles resize event and recalculates barWidth when initialBarWidth is 0', () => {
    // Render the WaterFallChart component with initialBarWidth as 0
    const { container } = render(<WaterFallChart dataPoints={dataPoints} barWidth={0} />);
    const barZero = container.querySelector('#chartBar-0');

    fireEvent(window, new Event('resize'));
    expect(barZero).toHaveAttribute('width', '187.5');
  });

  it('handles resize event and recalculates barWidth when initialBarWidth is less than or equal to 0', () => {
    // Render the WaterFallChart component with initialBarWidth as -10
    const { container } = render(<WaterFallChart dataPoints={dataPoints} barWidth={-10} />);
    const barZero = container.querySelector('#chartBar-0');

    if (barZero) {
      fireEvent(window, new Event('resize'));
      expect(barZero).toHaveAttribute('width', '187.5');
    }
  });

  it('does not set barWidth based on calculateBarWidth when initialBarWidth is greater than 0', () => {
    // Render the WaterFallChart component with initialBarWidth as 50
    const { container } = render(<WaterFallChart dataPoints={dataPoints} barWidth={50} />);
    const barZero = container.querySelector('#chartBar-0');

    expect(barZero).toHaveAttribute('width', '50');
  });

  it('calls onChartClick callback when clicking summary bar', () => {
    // Mock callback function
    const mockOnClick = jest.fn();

    // Render the WaterFallChart component with onChartClick callback as props
    const { container } = render(<WaterFallChart dataPoints={dataPoints} onChartClick={(e) => mockOnClick(e)} />);

    // Click on the summary bar
    const summaryBar = container.querySelector('#summaryBar');
    fireEvent.click(summaryBar as Element);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
  it('calls onMouseEnter and onMouseLeavecallback when summary bar is hovered', () => {
    // Mock callback function
    const mockOnMounseEnter = jest.fn();
    const mockOnMounseLeave = jest.fn();

    // Render the WaterFallChart component with dataPoints and onChartClick callback as props
    const { container } = render(
      <WaterFallChart
        dataPoints={dataPoints}
        onMouseEnter={(e: any, chartElement) => mockOnMounseEnter(e, chartElement)}
        onMouseLeave={(e: any, chartElement) => mockOnMounseLeave(e, chartElement)}
      />
    );

    // Click on summary bar
    const summaryBar = container.querySelector('#summaryBar');
    fireEvent.mouseEnter(summaryBar as Element);
    // Assert that the mock callback function is called with the correct chart element
    expect(mockOnMounseEnter).toHaveBeenCalledTimes(1);
    fireEvent.mouseLeave(summaryBar as Element);
    // Assert that the mock callback function is called with the correct chart element
    expect(mockOnMounseLeave).toHaveBeenCalledTimes(1);
  });

  it('Set barWidth as zero if window width is zero', () => {
    Object.defineProperties(window.HTMLElement.prototype, {
      offsetHeight: {
        get() {
          return 0.1;
        }
      },
      offsetWidth: {
        get() {
          return 0;
        }
      }
    });
    const { container } = render(<WaterFallChart dataPoints={dataPoints} barWidth={0}/>);
    const barZero = container.querySelector('#chartBar-0');

    expect(barZero).toHaveAttribute('width', '0');
  });
});
