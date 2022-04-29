import { CalendarHeatmap } from './calendar-heatmap.component';
import { generateStorySampleData } from './utils';

export default {
  title: 'Calendar Heat Map',
  component: CalendarHeatmap,
  args: {
    data: generateStorySampleData(10),
    onTooltip: (d) => {
      console.log(d);
    },
  },
};

const Template = (args) => <CalendarHeatmap {...args} />;

export const DefaultColor = Template.bind({});

export const Spectral = Template.bind({});
Spectral.args = {
  color: 'spectral',
};
