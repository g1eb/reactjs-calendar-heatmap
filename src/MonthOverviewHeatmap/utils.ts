import { extent, timeDays } from 'd3';
import { endOfMonth, startOfMonth, format } from 'date-fns';
import { removeLastYearWeekData } from '../utils';
import type { CalendarHeatmapDatum, BaseOverviewHeatmapProps } from '../utils';

export interface MonthOverviewDatum {
  day: number; // Store ISO day of week, 1-7 (Mon till Sun)
  week: number; // Store ISO week of year, 1-53
  total: number;
  date: Date;
}

interface MonthOverviewData {
  dataArray: MonthOverviewDatum[];
  totalExtent: [number, number];
}

export interface MonthOverviewHeatmapProps
  extends BaseOverviewHeatmapProps<MonthOverviewDatum> {
  data: CalendarHeatmapDatum[];
}

export function getWeekLabel(week: number): string {
  return `Week ${week}`;
}

export function getMonthData(data: CalendarHeatmapDatum[]): MonthOverviewData {
  let dataArray: MonthOverviewDatum[] = [];
  let minTotal: number | undefined;
  let maxTotal: number | undefined;

  if (data.length > 0) {
    // Contains date string to 'CalendarHeatmapDatum' record
    const dataRecord = data.reduce<Record<string, CalendarHeatmapDatum>>(
      (acc, curr) => ({
        ...acc,
        [new Date(curr.date).getDate().toString()]: curr,
      }),
      {}
    );
    // Selects an initial date for creating start and end date of that month
    const selectedDate = new Date(data[0].date);
    const minDate = startOfMonth(selectedDate);
    const maxDate = endOfMonth(selectedDate);

    // Adding missing data
    const consecutiveDates = timeDays(minDate, maxDate);
    const consecutiveDatesRecord = consecutiveDates.reduce<
      Record<string, CalendarHeatmapDatum>
    >(
      (acc, curr) => ({
        ...acc,
        [curr.getDate().toString()]: {
          date: curr.toISOString(),
          total: NaN,
        },
      }),
      {}
    );

    const combinedData = { ...consecutiveDatesRecord, ...dataRecord };
    dataArray = Object.values(combinedData).map<MonthOverviewDatum>((d) => {
      const date = new Date(d.date);
      return {
        day: Number.parseInt(format(date, 'i'), 10),
        week: Number.parseInt(format(date, 'I'), 10),
        total: d.total,
        date,
      };
    });

    // 'format(date, 'M')' returns month of a year as 1-12. Ref: https://date-fns.org/v2.28.0/docs/format
    if (format(selectedDate, 'M') === '1') {
      // If the data is of month 'January'
      dataArray = removeLastYearWeekData<MonthOverviewDatum>(dataArray);
    }

    [minTotal, maxTotal] = extent(dataArray, (d) => d.total);
  }
  return { dataArray, totalExtent: [minTotal ?? NaN, maxTotal ?? NaN] };
}
