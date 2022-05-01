import { timeDays, range } from 'd3';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { CalendarHeatmap } from './calendar-heatmap';
import type { CalendarHeatmapDatum } from './interfaces';

const generateDate = (date: Date): Date => {
  const projectDate = date;
  projectDate.setHours(Math.floor(Math.random() * 24));
  projectDate.setMinutes(Math.floor(Math.random() * 60));
  return projectDate;
};

function generateStorySampleData(yearsAgo: number): CalendarHeatmapDatum[] {
  const now = new Date();
  const timeAgo = new Date();
  timeAgo.setFullYear(timeAgo.getFullYear() - yearsAgo); // 'yearsAgo' years ago from now.
  timeAgo.setMonth(0); // Setting month to January.
  timeAgo.setDate(1); // Setting date to first of the given month.
  const data = timeDays(timeAgo, now).map((dateElement, index) => {
    const maxRange = Math.floor(Math.random() * 10); // Generate random integer 0 to 9.
    const details = range(maxRange).map((_e, i, arr) => {
      return {
        name: 'Project ' + Math.ceil(Math.random() * 10),
        date: generateDate(dateElement).toISOString(),
        value:
          3600 * ((arr.length - i) / 5) +
          Math.floor(Math.random() * 3600) *
            Math.round(Math.random() * (index / 365)),
      };
    });

    const total = details.reduce((acc, e) => {
      return acc + e.value;
    }, 0);

    return {
      date: dateElement.toISOString(),
      details,
      total,
    };
  });

  return data;
}

const Meta: ComponentMeta<typeof CalendarHeatmap> = {
  title: 'Calendar Heat Map',
  component: CalendarHeatmap,
  args: {
    data: generateStorySampleData(10),
    onTooltip: (d: { value: unknown }) => {
      console.log(d);
    },
  },
  argTypes: {
    color: {
      control: 'text',
    },
    overview: {
      control: 'text',
    },
  },
};
export default Meta;

const Template: ComponentStory<typeof CalendarHeatmap> = (args) => (
  <CalendarHeatmap {...args} />
);

export const DefaultColor = Template.bind({});

export const HSLColor = Template.bind({});
HSLColor.args = {
  color: 'hsl',
};

export const Spectral = Template.bind({});
Spectral.args = {
  color: 'spectral',
};

export const GlobalOverview = Template.bind({});
GlobalOverview.args = {
  color: 'spectral',
  overview: 'global',
};

export const MonthOverview = Template.bind({});
MonthOverview.args = {
  color: 'spectral',
  overview: 'month',
};

export const WeekOverview = Template.bind({});
WeekOverview.args = {
  color: 'spectral',
  overview: 'week',
};

export const DayOverview = Template.bind({});
DayOverview.args = {
  color: 'spectral',
  overview: 'day',
};
