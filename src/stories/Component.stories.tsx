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
  <div style={{ width: '100%', height: '100%', padding: '10% 20%' }}>
    <Component {...args} />
  </div>
);
export const WaterFallChart = Template.bind({});
WaterFallChart.args = {
  transactions: [
    {
      label: 'Income',
      value: 10
    },
    {
      label: 'Expense1',
      value: 3
    },
    {
      label: 'Gain1',
      value: -2
    },
    {
      label: 'Expense2',
      value: -60
    },
    {
      label: 'Gain2',
      value: 40
    },
    {
      label: 'Expense3',
      value: -10
    },
    {
      label: 'Gain3',
      value: 80
    }
  ]
};
