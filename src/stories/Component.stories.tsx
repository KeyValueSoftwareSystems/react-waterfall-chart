import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import WaterFallChart from '../waterfall-chart/WaterFallChart'; // Path to your component
import { IChartElement, IWaterfallGraphProps } from '../types/types';

export default {
  title: 'Components/WaterFallChart',
  component: WaterFallChart,
} as Meta;

const Template: Story<IWaterfallGraphProps> = (args) => <WaterFallChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  dataPoints: [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: -15 },
  ],
  // Pass other necessary props here
};

export const WithCustomLabels = Template.bind({});
WithCustomLabels.args = {
  dataPoints: [
    { label: 'January', value: 30 },
    { label: 'February', value: -10 },
    { label: 'March', value: 25 },
  ],
};

export const NoSummaryChart = Template.bind({});
NoSummaryChart.args = {
  dataPoints: [
    { label: 'X', value: 5 },
    { label: 'Y', value: 15 },
    { label: 'Z', value: -10 },
  ],
  showFinalSummary: false,
};

export const WithCustomStyles = Template.bind({});
WithCustomStyles.args = {
  dataPoints: [
    { label: 'Alpha', value: 12 },
    { label: 'Beta', value: -18 },
    { label: 'Gamma', value: 25 },
  ],
  styles: {
    positiveBar: { fill: 'green' },
    negativeBar: { fill: 'red' },
  },
};

const TemplateWithHover: Story<IWaterfallGraphProps> = (args) => {
  const [hoveredBar, setHoveredBar] = useState<IChartElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<any>();

  return (
    <div>
      <WaterFallChart {...args} onMouseEnter={(e, barValue) => {
        setHoveredBar(barValue);
        setHoveredElement(e);
      }}
      onMouseLeave={(e, barValue) => {
        setHoveredBar(null);
        setHoveredElement(null);
      }}
      />
      {hoveredBar && (
        <div style={{
          position: 'absolute',
          top: hoveredElement?.clientY,
          left: hoveredElement?.clientX,
          backgroundColor: 'black',
          color: 'white',
          height: '50px',
          width: '100px'
        }}>
          Value: {hoveredBar?.value}
        </div>
      )}
    </div>
  );
};

export const WithHoverValueDisplay = TemplateWithHover.bind({});
WithHoverValueDisplay.args = {
  dataPoints: [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: -15 },
  ],
  // Pass other necessary props here
};
