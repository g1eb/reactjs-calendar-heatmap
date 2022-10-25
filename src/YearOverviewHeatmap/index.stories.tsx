import { startOfYear, endOfYear } from 'date-fns';
import { generateStorySampleDataForHeatmap } from '../dev-utils';
import { YearOverviewHeatMap } from '.';
import type { CalendarHeatmapDatum } from '../utils';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import './index.css';

// Funtion to create filtered data of a year, to simulate parent component filtered data.
function filterYearData(data: CalendarHeatmapDatum[]): CalendarHeatmapDatum[] {
  let yearData = data;
  if (data.length > 0) {
    const selectedDate = new Date(data[0].date);
    const minDate = startOfYear(selectedDate);
    const maxDate = endOfYear(selectedDate);
    // Filter data down to the selected year
    yearData = data.filter(
      (d) => minDate <= new Date(d.date) && new Date(d.date) < maxDate
    );
  }
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
    className: 'light',
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

export const Rotate = Template.bind({});
Rotate.args = { response: 'rotate', showWeekLabels: true };

export const Dark = Template.bind({});
Dark.args = { className: 'dark' };

export const HSL = Template.bind({});
HSL.args = { color: 'hsl' };

export const HSLModified = Template.bind({});
HSLModified.args = { color: 'hslModified' };

export const Default = Template.bind({});
Default.args = { color: undefined };
