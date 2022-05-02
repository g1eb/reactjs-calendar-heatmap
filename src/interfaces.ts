export interface CalendarHeatmapDetail {
  date: string;
  name: string;
  value: number;
}

export interface CalendarHeatmapSummary {
  name: string;
  value: number;
}

export interface CalendarHeatmapDatum {
  date: string;
  total: number;
  details: CalendarHeatmapDetail[];
  summary?: CalendarHeatmapSummary[];
}

export type CalendarHeatmapOverview =
  | 'global'
  | 'year'
  | 'month'
  | 'week'
  | 'day';

export interface CalendarHeatmapSettings {
  gutter: number;
  item_gutter: number;
  width: number;
  height: number;
  item_size: number;
  label_padding: number;
  max_block_height: number;
  transition_duration: number;
  tooltip_width: number;
  tooltip_padding: number;
}

export interface CalendarHeatmapProps {
  data: CalendarHeatmapDatum[];
  color?: string;
  overview?: CalendarHeatmapOverview;
  handler?: (d: CalendarHeatmapDetail) => void;
  onTooltip?: (datum: { value: unknown }) => void;
  onHideTooltip?: () => void;
}

export interface CalendarHeatmapState {
  history: CalendarHeatmapOverview[];
  in_transition: boolean;
  selected: Partial<CalendarHeatmapDatum>;
  settings: CalendarHeatmapSettings;
  data: CalendarHeatmapDatum[];
}