import { axisTop } from '@d3fc/d3fc-axis';
import {
  easeLinear,
  extent,
  selectAll,
  timeDays,
  scaleThreshold,
  scaleTime,
} from 'd3';
import { endOfYear, format, startOfYear } from 'date-fns';
import { removeLastYearWeekData, addAxisLabelResponsivness } from '../utils';
import type {
  CalendarHeatmapDatum,
  BaseOverviewHeatmapProps,
  Margin,
  Response,
} from '../utils';
import type { D3FCAxis } from '@d3fc/d3fc-axis';
import type { ScaleBand, ScaleThreshold, ScaleTime, NumberValue } from 'd3';

export interface YearOverviewDatum {
  day: number; // Store ISO day of week, 1-7 (Mon till Sun)
  week: number; // Store ISO week of year, 1-53
  month: string; // Store month names. ex: 'Jan', 'Feb', 'Mar' etc.
  total: number;
  date: Date;
}

interface YearOverviewData {
  dataArray: YearOverviewDatum[];
  totalExtent: [number, number];
}

type ScaleType = 'threshold' | 'time';

export interface YearOverviewHeatmapProps
  extends BaseOverviewHeatmapProps<YearOverviewDatum> {
  data: CalendarHeatmapDatum[];
  showWeekLabels?: boolean;
  scaleType?: ScaleType;
  onMonthLabelClick?: (d: string) => void;
}

export function getYearData(data: CalendarHeatmapDatum[]): YearOverviewData {
  const { format: monthFormat } = new Intl.DateTimeFormat(undefined, {
    month: 'short',
  });
  let dataArray: YearOverviewDatum[] = [];
  let minTotal: number | undefined;
  let maxTotal: number | undefined;
  if (data.length > 0) {
    // Contains date string to 'CalendarHeatmapDatum' record
    const dataRecord = data.reduce<Record<string, CalendarHeatmapDatum>>(
      (acc, curr) => {
        const date = new Date(curr.date);
        return {
          ...acc,
          // 'format' functions here returns ISO week number (1-53) and day (1-7) of a date. Ref: https://date-fns.org/v2.28.0/docs/format
          [`${format(date, 'I')},${format(date, 'i')},${monthFormat(date)}`]:
            curr,
        };
      },
      {}
    );
    // Selects an initial date for creating start and end date of that year
    const selectedDate = new Date(data[0].date);
    const minDate = startOfYear(selectedDate);
    const maxDate = endOfYear(selectedDate);
    // Adding missing data
    const consecutiveDates = timeDays(minDate, maxDate);
    const consecutiveDatesRecord = consecutiveDates.reduce<
      Record<string, CalendarHeatmapDatum>
    >(
      (acc, curr) => ({
        ...acc,
        // 'format' functions here returns ISO week number (1-53) and day (1-7) of a date. Ref: https://date-fns.org/v2.28.0/docs/format
        [`${format(curr, 'I')},${format(curr, 'i')},${monthFormat(curr)}`]: {
          date: curr.toISOString(),
          total: NaN,
        },
      }),
      {}
    );
    const combinedData = { ...consecutiveDatesRecord, ...dataRecord };
    dataArray = Object.entries(combinedData).map<YearOverviewDatum>((d) => {
      const [week, day, month] = d[0].split(',');
      const { date } = d[1];
      return {
        day: Number.parseInt(day, 10),
        week: Number.parseInt(week, 10),
        month,
        total: d[1].total,
        date: new Date(date),
      };
    });
    // Remove data related to last week of the last year which spans over the first month of the current year.
    dataArray = removeLastYearWeekData<YearOverviewDatum>(dataArray);
    [minTotal, maxTotal] = extent(dataArray, (d) => d.total);
  }
  return {
    dataArray,
    totalExtent: [minTotal ?? NaN, maxTotal ?? NaN],
  };
}

/**
 * Ref: https://observablehq.com/@d3/calendar#Calendar
 * Create path boundaries between months in year overview heatmap
 * @param date
 * @param xScale
 * @param yScale
 * @returns
 */
export function getMonthBoundaryPath(
  date: Date,
  xScale: ScaleBand<string>,
  yScale: ScaleBand<string>
): string {
  // 'format' functions here returns ISO week number (1-53) and day (1-7) of a date. Ref: https://date-fns.org/v2.28.0/docs/format
  const week = Number.parseInt(format(date, 'I')) - 1; // Substracting by 1 because axis starts from position 0
  const day = Number.parseInt(format(date, 'i')) - 1; // Substracting by 1 because axis starts from position 0
  return `${
    day === 0
      ? /**
         * 1. M${week * xScale.bandwidth()},0 ===> If the first day of month is also first day of the week, draw a single vertical line to separate last month to the current month.
         * 2. M${(week + 1) * xScale.bandwidth()},0 ===> Move the starting point of path after 1 week label of first day of the month.
         * 3. V${day * yScale.bandwidth()} ===> Draw a vertical line from the starting point till the last day of the previous month.
         * 4. H${week * xScale.bandwidth()} ===> Draw a horizontal line from next week label to the current label (Since the first day of the month is not the first of the week, So it creates a horizontal separation between the previous and current day.
         * 5. V${7 * yScale.bandwidth()} ===> Draw a vertical line from the last drawn point till the end of the bottom x - axis.
         */
        `M${week * xScale.bandwidth()},0` // TODO: research about this line of code is pending.
      : `M${(week + 1) * xScale.bandwidth()},0
         V${day * yScale.bandwidth()}
         H${week * xScale.bandwidth()}`
  }V${7 * yScale.bandwidth()}`;
}

/**
 * Get the week label position index along the x-axis that we use to render month labels
 * @param firstDateOfMonth
 * @returns weekPosition
 */
export function getWeekPosition(firstDateOfMonth: Date): number {
  let weekPosition = NaN;
  const firstWeekOfMonth = Number.parseInt(format(firstDateOfMonth, 'I'), 10); // 1-53
  /**
   * Checking if the the month is 'January' and the first day of 'January' belongs to the last week of the last year.
   * If first day of January is part of  the last week of the last year then changing the position of 'Jan' label position from 52/53 to 1,
   * since the first column will be treated as the first week of 'January'.
   */
  if (firstDateOfMonth.getMonth() === 0) {
    weekPosition = 1;
  } else {
    weekPosition = firstWeekOfMonth;
  }

  return weekPosition;
}

/**
 * Fade month boundaries
 */
export function fadeMonthBoundaries(): void {
  selectAll<SVGLineElement, unknown>('.month-boundary')
    .transition()
    .duration(500)
    .ease(easeLinear)
    .style('opacity', 0.2);
}

/**
 * Brighten month boundaries
 */
export function brightenMonthBoundaries(): void {
  selectAll<SVGLineElement, unknown>('.month-boundary')
    .transition()
    .duration(500)
    .ease(easeLinear)
    .style('opacity', 1);
}

function getMonthThresholdScaleAndAxis({
  weekPositions,
  element,
  margin,
  monthLabels,
  response,
}: {
  weekPositions: number[];
  element: HTMLDivElement;
  margin: Margin;
  monthLabels: string[];
  response?: Response;
}): [ScaleThreshold<number, number>, D3FCAxis<number>] {
  const monthScaleDomain = [...weekPositions, 53];
  let monthAxisWidth = element.clientWidth - margin.left - margin.right;
  monthAxisWidth = monthAxisWidth > 0 ? monthAxisWidth : 0;
  const monthScaleRange = monthScaleDomain.map(
    (ele) => ((ele - 1) / 52) * monthAxisWidth
  );
  const monthScale = scaleThreshold()
    .domain(monthScaleDomain)
    .range([0, ...monthScaleRange, monthAxisWidth]);
  const monthAxis = axisTop(monthScale)
    .tickSize(0)
    .tickCenterLabel(true)
    .tickFormat((_, i) => monthLabels[i]);
  return [monthScale, addAxisLabelResponsivness(monthAxis, response)];
}

function getMonthTimeScaleAndAxis({
  element,
  margin,
  response,
  year,
}: {
  element: HTMLDivElement;
  margin: Margin;
  year: number;
  response?: Response;
}): [ScaleTime<number, number>, D3FCAxis<Date | NumberValue>] {
  let monthAxisWidth = element.clientWidth - margin.left - margin.right;
  monthAxisWidth = monthAxisWidth > 0 ? monthAxisWidth : 0;
  const monthScale = scaleTime()
    .domain([new Date(year, 0, 1), new Date(year, 11, 31)])
    .range([0, monthAxisWidth]);
  const monthAxis = axisTop(monthScale)
    .tickSize(0)
    .tickFormat((d) =>
      (d as Date).toLocaleString(undefined, { month: 'short' })
    );
  return [monthScale, addAxisLabelResponsivness(monthAxis, response)];
}

export function getMonthScaleAndAxis({
  weekPositions,
  element,
  margin,
  response,
  year,
  scaleType,
  monthLabels,
}: {
  weekPositions: number[];
  element: HTMLDivElement;
  margin: Margin;
  year: number;
  monthLabels: string[];
  response?: Response;
  scaleType?: ScaleType;
}):
  | [ScaleThreshold<number, number>, D3FCAxis<number>]
  | [ScaleTime<number, number>, D3FCAxis<Date | NumberValue>] {
  let xScaleAndAxis:
    | [ScaleThreshold<number, number>, D3FCAxis<number>]
    | [ScaleTime<number, number>, D3FCAxis<Date | NumberValue>]
    | undefined;
  switch (scaleType) {
    case 'threshold':
      xScaleAndAxis = getMonthThresholdScaleAndAxis({
        weekPositions,
        element,
        margin,
        response,
        monthLabels,
      });
      break;
    case 'time':
    default:
      xScaleAndAxis = getMonthTimeScaleAndAxis({
        element,
        margin,
        response,
        year,
      });
  }
  return xScaleAndAxis;
}
