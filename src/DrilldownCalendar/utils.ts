import type { DayOverviewHeatmapProps } from '../DayOverviewHeatmap/utils';
import type { CalendarHeatmapDatum, Response } from '../utils';
import type { HTMLProps } from 'react';

export type DrilldownCalendarOverview = 'global' | 'year' | 'month' | 'day';

export interface DrilldownCalendarProps
  extends Omit<HTMLProps<HTMLDivElement>, 'data'> {
  data?: CalendarHeatmapDatum[];
  color?: string;
  overview?: DrilldownCalendarOverview;
  response?: Response;
  showDayXAxisLabels?: boolean;
  onTooltip?: (datum: { value: unknown }) => void;
  onHideTooltip?: () => void;
  fetchGlobalData?: () => Promise<CalendarHeatmapDatum[]>; // For fetching global data for 'global', 'year', and 'month' overview heatmap.
  fetchDayData?: DayOverviewHeatmapProps['fetchDayData'];
}
