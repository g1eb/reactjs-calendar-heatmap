import { generateStorySampleDataForHeatmap } from '../dev-utils';
import { GlobalOverviewHeatMap } from '.';
import './index.css';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

const Meta: ComponentMeta<typeof GlobalOverviewHeatMap> = {
  title: 'GlobalOverviewHeatMap',
  component: GlobalOverviewHeatMap,
  args: {
    data: generateStorySampleDataForHeatmap(2, 1),
    onTooltip: (d: { value: unknown }) => d,
    color: 'spectral',
    className: 'light',
  },
};
export default Meta;

const Template: ComponentStory<typeof GlobalOverviewHeatMap> = (args) => (
  <GlobalOverviewHeatMap
    {...args}
    style={{ height: '90vh', width: '100%', border: '1px solid black' }}
  />
);

export const Light = Template.bind({});

export const Dark = Template.bind({});
Dark.args = { className: 'dark' };

export const HSL = Template.bind({});
HSL.args = { color: 'hsl' };

export const HSLModified = Template.bind({});
HSLModified.args = { color: 'hslModified' };

export const Default = Template.bind({});
Default.args = { color: undefined };
