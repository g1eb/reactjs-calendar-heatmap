import { rollup, sum, extent, range } from 'd3';
import type {
  CalendarHeatmapDatum,
  Margin,
  BaseOverviewHeatmapProps,
} from '../utils';
import type { ScaleBand } from 'd3';

export interface GlobalOverviewDatum {
  year: number;
  total: number;
}

interface GlobalOverviewData {
  dataArray: GlobalOverviewDatum[];
  yearExtent: [number, number];
  totalExtent: [number, number];
}

export interface GlobalOverviewHeatmapProps
  extends BaseOverviewHeatmapProps<GlobalOverviewDatum> {
  data: CalendarHeatmapDatum[];
}

export function getGlobalHeatmapCellDimensions(
  element: HTMLDivElement,
  xScale: ScaleBand<string>,
  margin: Margin
): [number, number] {
  const { clientHeight } = element;
  const width = xScale.bandwidth();
  let height = clientHeight - margin.top - margin.bottom;
  height = height > 0 ? height : 0;
  return [width, height];
}

export function getGlobalData(
  data: CalendarHeatmapDatum[]
): GlobalOverviewData {
  let dataArray: GlobalOverviewDatum[] = [];
  let minTotal: number | undefined;
  let maxTotal: number | undefined;
  let minYear: number | undefined;
  let maxYear: number | undefined;

  if (data.length > 0) {
    // Grouping available data
    const groupedData = rollup(
      data,
      (g) => sum(g, (d) => d.total),
      (d) => new Date(d.date).getFullYear()
    );

    // Adding missing data
    const yearsPresent = Array.from(groupedData.keys()); // Using 'Array.from()' to convert keys "iterator" to "array"
    [minYear, maxYear] = extent(yearsPresent);
    minYear = minYear ?? NaN;
    maxYear = maxYear ?? NaN;

    const consecutiveYears = range(minYear, maxYear + 1);
    const consecutiveYearsMap = consecutiveYears.reduce((acc, curr) => {
      acc.set(curr, NaN);
      return acc;
    }, new Map<number, number>());

    const combinedData = new Map([...consecutiveYearsMap, ...groupedData]);

    // Deriving final data from merged data
    const yearTotalDataArray = Array.from(combinedData); // Using 'Array.from()' to convert keys "iterator" to "array"
    dataArray = yearTotalDataArray.map<GlobalOverviewDatum>((ele) => ({
      year: ele[0],
      total: ele[1],
    }));

    [minTotal, maxTotal] = extent(dataArray, (d) => d.total);
  }
  return {
    dataArray,
    yearExtent: [minYear ?? NaN, maxYear ?? NaN],
    totalExtent: [minTotal ?? NaN, maxTotal ?? NaN],
  };
}
