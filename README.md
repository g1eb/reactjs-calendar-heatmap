# Drilldown Calendar Heatmap | ReactJS | D3

[![](https://data.jsdelivr.com/v1/package/npm/@manufac/reactjs-calendar-heatmap/badge)](https://www.jsdelivr.com/package/npm/@manufac/reactjs-calendar-heatmap)

This [d3.js](https://d3js.org/) heatmap representing time series data is used **to visualize the frequency of an entity over time**.

Includes a global overview of multiple years and visualizations of year, month and day overviews.

Inspired by

* [Calendar](https://observablehq.com/@d3/calendar) by [Mike Bostock](https://github.com/mbostock)
* [ReactJS Calendar Heatmap](https://github.com/g1eb/reactjs-calendar-heatmap) by [Gleb](https://github.com/g1eb)

### Demo

[Live Link](https://manufac-analytics.github.io/reactjs-calendar-heatmap/)

### Global overview

![Global](https://user-images.githubusercontent.com/25290212/170020601-08ab3317-1c63-46fc-89b8-29a4938b1fb3.png)

### Year overview

![Year](https://user-images.githubusercontent.com/25290212/170017623-2ac854e0-5451-4ce4-871e-e90d730f51f2.png)

### Month overview

![Month](https://user-images.githubusercontent.com/25290212/170018109-49a91af8-f2b0-4c2f-9368-133bf90ddeae.png)

### Day overview

![Day](https://user-images.githubusercontent.com/25290212/170018241-2b68707c-2655-49db-99d9-498e8c92656f.png)

## Install

1. Install `@manufac/reactjs-calendar-heatmap` with `yarn` (or `npm`):

```
yarn add @manufac/reactjs-calendar-heatmap
```

[NPM Location](https://www.npmjs.com/package/@manufac/reactjs-calendar-heatmap)

2. Import `DrilldownCalendar` in your component

```js
import {
    DrilldownCalendar
} from '@manufac/reactjs-calendar-heatmap';
```

3. Render `DrilldownCalendar` component

```jsx
<DrilldownCalendar
  color={color}
  data={data}
  overview={overview}
  response={response}
  showDayXAxisLabels={showDayXAxisLabels}
  onTooltip={show}
  onHideTooltip={hide}
  fetchGlobalData={fetchGlobalData}
  fetchDayData={fetchDayData}
/>
```

## CDN

Available via [JSDelivr](https://www.jsdelivr.com/package/npm/@manufac/reactjs-calendar-heatmap).

### Interfaces

```ts
export interface CalendarHeatmapDetail {
  date: string;
  value: number;
}
```

```ts
interface CalendarHeatmapDatum {
  date: string;
  total: number;
  details?: CalendarHeatmapDetail[];
}
```

### Properties

| Property           | Type                                                                                                   | Usage                                                               |   Default   | Required |
|:-------------------|:-------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------|:-----------:|:--------:|
| data               | `CalendarHeatmapDatum[]` | Time series data spanning over 1 year or more years                 |    none     |   yes    |
| color              | color hex code, valid css color name or color scheme names ( `'spectral'` , `'hsl'` , or `'hslModified'` ) | Theme color for the visual elements                                 | `'#ff4500'` |    no    |
| overview           | `'global' \| 'year' \| 'month' \| 'week' \| 'day'` | Initial overview for the map                                        | `'year'` |    no    |
| response           | `'hide' \| 'rotate' \| 'offset'` | Responsiveness strategy for handling overlapping axis labels        | `'hide'` |    no    |
| showDayXAxisLabels | `boolean` | To show X Axis labels for day overview heatmap                      |    none     |    no    |
| onTooltip          | `(datum: { value: unknown }) => void;` | onTooltip function is fired on "mouseover" over a visual element    |    none     |    no    |
| onHideTooltip      | `() => void;` | onHideTooltip function is fired on "mouseout" over a visual element |    none     |    no    |
| fetchGlobalData | `() => Promise<CalendarHeatmapDatum[]>;` | To fetch data for 'global', 'year' or 'month' overview heatmap from a REST API | none | no
| fetchDayData | `(dateTime: string) => Promise<CalendarHeatmapDatum['details']>;` | To fetch data for 'day' overview heatmap from a REST API | none | no

### Example data

The data contains:

* Day-by-day frequency of an arbitrary event spaninng across 1 or more years
* For each data point, the intra-day frequency is also optionally listed in `details`

```js
var data = [{
        "date": "2016-01-01",
        "total": 17164,
        "details": [{
                "date": "2016-01-01 12:30:45",
                "value": 9192
            },
            ...{
                "date": "2016-01-01 17:52:41",
                "value": 1219
            }
        ]
    },
    {
        "date": "2016-01-02",
        "total": 17100,
        "details": [{
                "date": "2016-01-02 11:30:00",
                "value": 9132
            },
            ...{
                "date": "2016-01-02 15:52:00",
                "value": 1219
            }
        ]
    }
]
```
