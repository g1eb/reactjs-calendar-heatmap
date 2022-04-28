import { CalendarHeatmap } from './calendar-heatmap.component';
import { timeDays, range } from 'd3';

export default {
  title: 'Calendar Heat Map',
  component: CalendarHeatmap,
};

const Template = (args) => <CalendarHeatmap {...args} />;

const generateDate = (dateElement) => {
  const projectDate = new Date(dateElement.getTime());
  projectDate.setHours(Math.floor(Math.random() * 24));
  projectDate.setMinutes(Math.floor(Math.random() * 60));
  return projectDate;
};

const now = new Date();
const timeAgo = new Date();
timeAgo.setFullYear(timeAgo.getFullYear() - 10); // 10 years ago from now.
timeAgo.setMonth(0); // Setting month to January.
timeAgo.setDate(1); // Setting date to first of the given month.
const data = timeDays(timeAgo, now).map((dateElement, index) => {
  const date = dateElement.toISOString();
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
    date,
    details,
    total,
  };
});

export const CalendarHeatmapWithDefaultColor = Template.bind({});

CalendarHeatmapWithDefaultColor.args = {
  data,
  onTooltip: (d) => {
    console.log(d);
  },
};

export const CalendarHeatmapWithSpectralColor = Template.bind({});

CalendarHeatmapWithSpectralColor.args = {
  ...CalendarHeatmapWithDefaultColor.args,
  color: 'spectral',
};
