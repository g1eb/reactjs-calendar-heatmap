import { extent } from 'd3';
import { eachHourOfInterval, startOfDay, endOfDay } from 'date-fns';
import type { CalendarHeatmapDatum, BaseOverviewHeatmapProps } from '../utils';

export interface DayOverviewDatum {
  date: Date;
  col: number; // Contains column position of a cell
  hour: number;
  value: number;
}

interface DayOverviewData {
  dataArray: DayOverviewDatum[];
  valueExtent: [number, number];
}

export interface DayOverviewHeatmapProps
  extends BaseOverviewHeatmapProps<DayOverviewDatum> {
  data: CalendarHeatmapDatum;
  showXAxisLabels?: boolean;
  fetchDayData?: (dateTime: string) => Promise<CalendarHeatmapDatum['details']>; // For fetching day data for 'day' overview heatmap with bin size of minutes interval.
}

/**
 * Create x axis labels with bin number
 * @param bin
 * @returns
 */
export function createXAxisLabel(bin: number): string {
  return `Bin ${bin + 1}`;
}

/**
 *
 * @param data
 * @returns
 */
export function getDayData(data: CalendarHeatmapDatum): DayOverviewData {
  const binCountPerHour = Math.ceil((data.details?.length ?? 0) / 24);

  const dataArray: DayOverviewDatum[] =
    data.details
      ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sorting 'data.details' in ascending order
      .map((e, idx) => {
        const date = new Date(e.date);
        return {
          date,
          col: idx % binCountPerHour, // 'data.details' needs to be sorted in ascending order for it to work.
          hour: date.getHours(),
          value: e.value,
        };
      }) ?? [];

  const [minValue, maxValue] = extent(dataArray, (d) => d.value);
  return {
    dataArray,
    valueExtent: [minValue ?? NaN, maxValue ?? NaN],
  };
}

function convertDatetoYAxisLabel(date: Date) {
  return date.toLocaleString(undefined, { hour12: true, hour: '2-digit' });
}

export function generateYAxisLabels(): string[] {
  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);
  const labels = eachHourOfInterval({
    start: startOfToday,
    end: endOfToday,
  }).map((date) => convertDatetoYAxisLabel(date));
  return labels;
}
