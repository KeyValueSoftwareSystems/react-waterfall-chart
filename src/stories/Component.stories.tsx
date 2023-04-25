import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Component from '../waterfall-chart';

export default {
  title: 'Example/WaterFallChart',
  component: Component,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <div style={{ width: '100%', height: '100%', padding: '100px 200px' }}>
    <Component {...args} />
  </div>
);
export const WaterFallChart = Template.bind({});
WaterFallChart.args = {
  transactions: [
    {
      label: 'Revenue',
      value: 10
    },
    {
      label: 'Interests',
      value: 3
    },
    {
      label: 'R&D',
      value: -2
    },
    {
      label: 'Marketing',
      value: -60
    },
    {
      label: 'Consulting',
      value: 40
    },
    {
      label: 'Repairs',
      value: -10
    },
    {
      label: 'Acquisitions',
      value: 80
    }
  ]
};
