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
  <Component {...args} />
);

export const WaterFallChart = Template.bind({});
WaterFallChart.args = {
  transactions: [{
    label: 'Income',
    value: 300
  },{
  label: 'Expense1',
  value: -60
},{
  label: 'Gain1',
  value: 200
},{
  label: 'Expense2',
  value: -100
},{
  label: 'Gain2',
  value: 200
}
]
};
