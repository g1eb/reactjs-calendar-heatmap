# React component for D3.js Calendar Heatmap

This [d3.js](https://d3js.org/) heatmap representing time series data is used to visualize tracked time over the past year, showing details for each of the days on demand.

Includes a global overview of multiple years and visualizations of year, month, week and day overview with zoom for details-on-demand.

- Inspired by [Github's contribution graph](https://help.github.com/articles/viewing-contributions-on-your-profile/#contributions-calendar)
- Based on [Calendar View](https://bl.ocks.org/mbostock/4063318) by [Mike Bostock](https://github.com/mbostock)
- Based on [D3.js Calendar Heatmap](https://github.com/DKirwan/calendar-heatmap) by [Darragh Kirwan](https://github.com/DKirwan)
- Based on [ReactJS Calendar Heatmap](https://github.com/g1eb/reactjs-calendar-heatmap) by [Gleb](https://github.com/g1eb)

[Live Demo](https://manufac-analytics.github.io/reactjs-calendar-heatmap/).

### Global overview

[![calendar heatmap - global overview](https://raw.githubusercontent.com/g1eb/reactjs-calendar-heatmap/master/images/screenshot_global_overview.png)](https://rawgit.com/g1eb/reactjs-calendar-heatmap/master/)

### Year overview

[![calendar heatmap - year overview](https://raw.githubusercontent.com/g1eb/reactjs-calendar-heatmap/master/images/screenshot_year_overview.png)](https://rawgit.com/g1eb/reactjs-calendar-heatmap/master/)

### Month overview

[![calendar heatmap - month overview](https://raw.githubusercontent.com/g1eb/reactjs-calendar-heatmap/master/images/screenshot_month_overview.png)](https://rawgit.com/g1eb/reactjs-calendar-heatmap/master/)

### Week overview

[![calendar heatmap - week overview](https://raw.githubusercontent.com/g1eb/reactjs-calendar-heatmap/master/images/screenshot_week_overview.png)](https://rawgit.com/g1eb/reactjs-calendar-heatmap/master/)

### Day overview

[![calendar heatmap - day overview](https://raw.githubusercontent.com/g1eb/reactjs-calendar-heatmap/master/images/screenshot_day_overview.png)](https://rawgit.com/g1eb/reactjs-calendar-heatmap/master/)

## Install

1. Install `@manufac/reactjs-calendar-heatmap` with `yarn` (or `npm`):

```
yarn add @manufac/reactjs-calendar-heatmap
```

2. Import `CalendarHeatmap` in your component

```js
import { CalendarHeatmap } from '@manufac/reactjs-calendar-heatmap';
```

3. Render `CalendarHeatmap` component

```jsx
<CalendarHeatmap
  data={data}
  color={color}
  overview={overview}
  handler={print}
  onTooltip={show}
  onHideTooltip={hide}
/>
```

### Properties

<table>
  <tr>
    <th>Property</th>
    <th>Interface</th>
    <th>Usage</th>
    <th>Default</th>
    <th>Required</th>
  </tr>
  <tr> 
    <td>
      data
    </td>
    <td>
      <pre>
        interface CalendarHeatmapDatum {
          date: string;
          total: number;
          details: { name: string; date: string; value: number }[];
          summary?: { name: string; value: number }[];
        }
      </pre>
    </td>
    <td>
      Time series data from max a year back  
    </td>
    <td>
      none
    </td>
    <td>
      yes
    </td>
  </tr>
  <tr> 
    <td>
      color
    </td>
    <td>
      <pre>
        string
      </pre>
    </td>
    <td>
      Theme color in hex code, color names or enum values (choices are: 'spectral') 
    </td>
    <td>
      #ff4500
    </td>
    <td>
      no
    </td>
  </tr>
  <tr> 
    <td>
      overview
    </td>
    <td>
      <pre>
        type CalendarHeatmapOverview = 
            |'global'
            | 'year'
            | 'month'
            | 'week'
            | 'day'
      </pre>
    </td>
    <td>
      Initial overview type (choices are: global, year, month, week, day)
    </td>
    <td>
      year
    </td>
    <td>
      no
    </td>
  </tr>
  <tr> 
    <td>
      handler
    </td>
    <td>
      <pre>
        (d: data) => void;
      </pre>
    </td>
    <td>
      Handler function is fired on click of a time entry in daily overview
    </td>
    <td>
      none
    </td>
    <td>
      no
    </td>
  </tr>
  <tr> 
    <td>
      onTooltip
    </td>
    <td>
      <pre>
        (datum: { value: unknown }) => void;
      </pre>
    </td>
    <td>
      onTooltip function is fired on "mouseover" over a visual element
    </td>
    <td>
      none
    </td>
    <td>
      no
    </td>
  </tr>
  <tr> 
    <td>
      onHideTooltip
    </td>
    <td>
      <pre>
        () => void;
      </pre>
    </td>
    <td>
      onHideTooltip function is fired on "mouseout" over a visual element
    </td>
    <td>
      none
    </td>
    <td>
      no
    </td>
  </tr>
</table>

### Example data

Time series data where each day has a total time tracked (in seconds).  
Details, if provided, are shown in a tooltip on mouseover in different overviews.

```js
var data = [{
  "date": "2016-01-01",
  "total": 17164,
  "details": [{
    "name": "Project 1",
    "date": "2016-01-01 12:30:45",
    "value": 9192
  }, {
    "name": "Project 2",
    "date": "2016-01-01 13:37:00",
    "value": 6753
  },
  .....
  {
    "name": "Project N",
    "date": "2016-01-01 17:52:41",
    "value": 1219
  }]
}]
```

### Optimization

In some cases details array could be large and in order to fit the data into the tooltip a short summary is generated with distinct projects and their total tracked time for that date.
In terms of optimization, summary data can be computed server-side and passed in using the ``summary'' attribute.
And in addition to the data structure described above this would result in a summary dictionary with distinct project names and total values of tracked time in seconds, e.g.:

```js
var data = [{
  "date": "2016-01-01",
  "total": 17164,
  "details": [.....],
  "summary": [{
    "name": "Project 1",
    "value": 9192
  }, {
    "name": "Project 2",
    "value": 6753
  },
  .....
  {
    "name": "Project N",
    "value": 1219
  }]
}]
```

## Dependencies

- [react.js](https://reactjs.org/)
- [moment.js](https://momentjs.com/)
- [d3.js](https://d3js.org/)
