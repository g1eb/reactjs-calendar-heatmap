interface CalendarHeatmapDatum {
    date: string;
}

type CalendarHeatmapOverview = 'global' | 'year' | 'month' | 'week' | 'day';

interface CalendarHeatmapProps {
    data: CalendarHeatmapDatum[];
    color?: string;
    overview?: CalendarHeatmapOverview;
    handler?: (d: CalendarHeatmapDatum) => void;
}

interface CalendarHeatmapSettings {
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

declare class CalendarHeatmap extends React.Component<CalendarHeatmapProps, unknown> {
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

declare module 'reactjs-calendar-heatmap' {
    export = CalendarHeatmap;
}