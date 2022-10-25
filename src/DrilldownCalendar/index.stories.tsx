import { generateStorySampleDataForHeatmap } from '../dev-utils';
import { DrilldownCalendar } from '.';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import './index.css';

const Meta: ComponentMeta<typeof DrilldownCalendar> = {
  title: 'DrilldownCalendar',
  component: DrilldownCalendar,
  args: {
    data: generateStorySampleDataForHeatmap(2, 3),
    onTooltip: (d: { value: unknown }) => d,
    color: 'spectral',
    className: 'light',
  },
};
export default Meta;

const Template: ComponentStory<typeof DrilldownCalendar> = (args) => (
  <DrilldownCalendar
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

export const DrilldownYearOverview = Template.bind({});
DrilldownYearOverview.args = { overview: 'year' };

export const DrilldownMonthOverview = Template.bind({});
DrilldownMonthOverview.args = { overview: 'month' };

export const DrilldownDayOverview = Template.bind({});
DrilldownDayOverview.args = { overview: 'day' };

export const DrilldownDayOverviewWithoutXAxisLabels = Template.bind({});
DrilldownDayOverviewWithoutXAxisLabels.args = {
  overview: 'day',
  showDayXAxisLabels: false,
};

export const LiveData = Template.bind({});
LiveData.args = {
  data: [
    {
      date: '2022-04-28T00:00:00.000Z',
      total: 148471,
    },
    {
      date: '2022-04-29T00:00:00.000Z',
      total: 122342,
    },
    {
      date: '2022-04-30T00:00:00.000Z',
      total: 120133,
    },
    {
      date: '2022-05-01T00:00:00.000Z',
      total: 109908,
    },
    {
      date: '2022-05-02T00:00:00.000Z',
      total: 108752,
    },
    {
      date: '2022-05-03T00:00:00.000Z',
      total: 146205,
    },
    {
      date: '2022-05-04T00:00:00.000Z',
      total: 124881,
    },
    {
      date: '2022-05-05T00:00:00.000Z',
      total: 164011,
    },
    {
      date: '2022-05-06T00:00:00.000Z',
      total: 177959,
    },
    {
      date: '2022-05-07T00:00:00.000Z',
      total: 127550,
    },
    {
      date: '2022-05-08T00:00:00.000Z',
      total: 97882,
    },
    {
      date: '2022-05-09T00:00:00.000Z',
      total: 135627,
    },
    {
      date: '2022-05-10T00:00:00.000Z',
      total: 182670,
    },
    {
      date: '2022-05-11T00:00:00.000Z',
      total: 229608,
    },
    {
      date: '2022-05-12T00:00:00.000Z',
      total: 368919,
    },
    {
      date: '2022-05-13T00:00:00.000Z',
      total: 45356,
    },
    {
      date: '2022-05-14T00:00:00.000Z',
      total: 499057,
    },
    {
      date: '2022-05-15T00:00:00.000Z',
      total: 455587,
    },
    {
      date: '2022-05-16T00:00:00.000Z',
      total: 472499,
    },
    {
      date: '2022-05-17T00:00:00.000Z',
      total: 214326,
    },
    {
      date: '2022-05-18T00:00:00.000Z',
      total: 166338,
    },
    {
      date: '2022-05-19T00:00:00.000Z',
      total: 355811,
    },
    {
      date: '2022-05-20T00:00:00.000Z',
      total: 274293,
    },
    {
      date: '2022-05-21T00:00:00.000Z',
      total: 274275,
    },
    {
      date: '2022-05-22T00:00:00.000Z',
      total: 267865,
    },
    {
      date: '2022-05-23T00:00:00.000Z',
      total: 191128,
    },
    {
      date: '2022-05-24T00:00:00.000Z',
      total: 338148,
    },
    {
      date: '2022-05-25T00:00:00.000Z',
      total: 349940,
    },
  ],
};
