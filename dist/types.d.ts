import type { Component } from "react";

export interface CalendarHeatmapDatum {
    date: string;
}

export type CalendarHeatmapOverview = 'global' | 'year' | 'month' | 'week' | 'day';

export interface CalendarHeatmapProps {
    data: CalendarHeatmapDatum[];
    color?: string;
    overview?: CalendarHeatmapOverview;
    handler?: (d: CalendarHeatmapDatum) => void;
}

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

export class CalendarHeatmap extends Component<CalendarHeatmapProps, unknown> {
    settings: CalendarHeatmapSettings;
    in_transition: boolean;
    overview: CalendarHeatmapOverview;
    history: CalendarHeatmapOverview[];
    selected: CalendarHeatmapDatum;

    calcDimensions: () => void;
    createElements: () => void;

    parseData: () => void;
    formatTime: (seconds: number) => string;

    hideTooltip: () => void;
    drawButton: () => void;
    hideBackButton: () => void;

    drawGlobalOverview: () => void;
    removeGlobalOverview: () => void;

    drawYearOverview: () => void;
    removeYearOverview: () => void;

    drawMonthOverview: () => void;
    removeMonthOverview: () => void;

    drawWeekOverview: () => void;
    removeWeekOverview: () => void;

    drawDayOverview: () => void;
    removeDayOverview: () => void;

    drawChart: () => void;
}

export default CalendarHeatmap;