import type { CalendarHeatmapDatum, Response } from '../utils';
import type { HTMLProps } from 'react';

export type DrilldownCalendarOverview = 'global' | 'year' | 'month' | 'day';

export interface DrilldownCalendarProps
  extends Omit<HTMLProps<HTMLDivElement>, 'data'> {
  data: CalendarHeatmapDatum[];
  color?: string;
  overview?: DrilldownCalendarOverview;
  response?: Response;
  onTooltip?: (datum: { value: unknown }) => void;
  onHideTooltip?: () => void;
}
