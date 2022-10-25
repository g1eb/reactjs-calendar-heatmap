import { generateStorySampleDataForHeatmap } from '../dev-utils';
import { DayOverviewHeatMap } from '.';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import './index.css';

const Meta: ComponentMeta<typeof DayOverviewHeatMap> = {
  title: 'DayOverviewHeatMap',
  component: DayOverviewHeatMap,
  args: {
    data: generateStorySampleDataForHeatmap(1, 3)[0],
    onTooltip: (d: { value: unknown }) => d,
    color: 'spectral',
    className: 'light',
  },
};
export default Meta;

const Template: ComponentStory<typeof DayOverviewHeatMap> = (args) => (
  <DayOverviewHeatMap
    {...args}
    style={{ height: '90vh', width: '100%', border: '1px solid black' }}
  />
);

export const Light = Template.bind({});

export const Dark = Template.bind({});
Dark.args = { className: 'dark' };

export const WithoutXAxisLabels = Template.bind({});
WithoutXAxisLabels.args = { showXAxisLabels: false };

export const HSL = Template.bind({});
HSL.args = { color: 'hsl' };

export const HSLModified = Template.bind({});
HSLModified.args = { color: 'hslModified' };

export const Default = Template.bind({});
Default.args = { color: undefined };

export const Bin6 = Template.bind({});
Bin6.args = { data: generateStorySampleDataForHeatmap(1, 6)[0] };

export const Bin30 = Template.bind({});
Bin30.args = { data: generateStorySampleDataForHeatmap(1, 30)[0] };

export const Bin60 = Template.bind({});
Bin60.args = { data: generateStorySampleDataForHeatmap(1, 60)[0] };
