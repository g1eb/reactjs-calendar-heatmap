import { CalendarHeatmap } from './calendar-heatmap.component';
import { timeDays, range } from 'd3';


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

export default {
  title: 'Calendar Heat Map',
  component: CalendarHeatmap,
  args: {
    data,
    onTooltip: (d) => {
      console.log(d);
    },
  },
  argTypes: {
    color: {
      control: "text"
    },
    overview: {
      control: "text"
    }
  }
};

const Template = (args) => <CalendarHeatmap {...args} />;

export const DefaultColor = Template.bind({});

export const Spectral = Template.bind({});
Spectral.args = {
  color: 'spectral',
};


export const MonthOverview = Template.bind({});
MonthOverview.args = {
  color: 'spectral',
  overview: "month"
};

export const DayOverview = Template.bind({});
DayOverview.args = {
  color: 'spectral',
  overview: "day"
};