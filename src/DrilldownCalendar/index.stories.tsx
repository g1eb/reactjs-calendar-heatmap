import { generateStorySampleDataForHeatmap } from '../dev-utils';
import { DrilldownCalendar } from '.';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import './index.css';

const Meta: ComponentMeta<typeof DrilldownCalendar> = {
  title: 'DrilldownCalendar',
  component: DrilldownCalendar,
  args: {
    data: generateStorySampleDataForHeatmap(2, 10),
    onTooltip: (d: { value: unknown }) => {
      console.log(d);
    },
    color: 'spectral',
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
Light.args = { className: 'light' };

export const Dark = Template.bind({});
Dark.args = { className: 'dark' };

export const HSL = Template.bind({});
HSL.args = { color: 'hsl' };

export const Default = Template.bind({});
Default.args = { color: undefined };
