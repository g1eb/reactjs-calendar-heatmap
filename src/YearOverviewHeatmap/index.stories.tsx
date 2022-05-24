import { startOfYear, endOfYear } from 'date-fns';
import { generateStorySampleDataForHeatmap } from '../dev-utils';
import { YearOverviewHeatMap } from '.';
import type { CalendarHeatmapDatum } from '../utils';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import './index.css';

// Funtion to create filtered data of a year, to simulate parent component filtered data.
function filterYearData(data: CalendarHeatmapDatum[]): CalendarHeatmapDatum[] {
  const selectedDate = new Date(data[0].date);
  const minDate = startOfYear(selectedDate);
  const maxDate = endOfYear(selectedDate);
  // Filter data down to the selected year
  const yearData = data.filter((d) => {
    return minDate <= new Date(d.date) && new Date(d.date) < maxDate;
  });
  return yearData;
}

const Meta: ComponentMeta<typeof YearOverviewHeatMap> = {
  title: 'YearOverviewHeatMap',
  component: YearOverviewHeatMap,
  args: {
    data: filterYearData(generateStorySampleDataForHeatmap(1, 1)),
    onTooltip: (d: { value: unknown }) => {
      console.log(d);
    },
    color: 'spectral',
  },
};
export default Meta;

const Template: ComponentStory<typeof YearOverviewHeatMap> = (args) => (
  <YearOverviewHeatMap
    {...args}
    style={{ height: '90vh', width: '100%', border: '1px solid black' }}
  />
);

export const Light = Template.bind({});
Light.args = { className: 'light' };

export const Rotate = Template.bind({});
Rotate.args = { className: 'light', response: 'rotate', showWeekLabels: true };

export const Dark = Template.bind({});
Dark.args = { className: 'dark' };

export const HSL = Template.bind({});
HSL.args = { color: 'hsl' };

export const Default = Template.bind({});
Default.args = { color: undefined };
