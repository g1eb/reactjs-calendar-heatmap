import { easeLinear, select, selectAll } from 'd3';
import { useEffect, useRef } from 'react';
import {
  createColorGenerator,
  getXScaleAndAxis,
  getYScaleAndAxis,
  fadeAwayElements,
  getColor,
} from '../utils';
import { getMonthData, getWeekLabel } from './utils';
import type { Margin } from '../utils';
import type { MonthOverviewHeatmapProps, MonthOverviewDatum } from './utils';
import type { Selection } from 'd3';

/**
 * Ref: https://bl.ocks.org/Bl3f/cdb5ad854b376765fa99
 * @param param0
 * @returns
 */
export function MonthOverviewHeatMap({
  data, // Filtered data for a particular month from the parent component
  color,
  onCellClick,
  onTooltip,
  onHideTooltip,
  fade,
  onFadeComplete,
  response,
  ...rest
}: MonthOverviewHeatmapProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const margin: Margin = { top: 50, bottom: 50, left: 50, right: 50 };

    let svg: Selection<SVGSVGElement, unknown, null, undefined> | undefined;
    let resize: (() => void) | undefined;
    if (ref.current !== null && data.length > 0) {
      // Create array of object containing week, day and total values and min and max total values in a month
      const { dataArray, totalExtent } = getMonthData(data);

      const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weekLabels = [
        ...new Set(dataArray.map((e) => getWeekLabel(e.week))),
      ];

      // Calculate min and max total of the month in the dataset
      const [minTotal, maxTotal] = totalExtent;

      // Generates color generator function
      const colorGenerator = createColorGenerator(minTotal, maxTotal, color);

      // X Axis
      const [xScale, xAxis] = getXScaleAndAxis({
        labels: weekLabels,
        element: ref.current,
        margin,
        paddingInner: 0.2,
        response,
      });

      // Y Axis
      const [yScale, yAxis] = getYScaleAndAxis({
        labels: dayLabels,
        element: ref.current,
        margin,
        paddingInner: 0,
        response,
      });
      svg = select(ref.current)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('cursor', 'pointer');

      // Draw parent 'g' tag for heat cells
      const parent = svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Draw x axis
      svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('class', 'x-axis')
        .call(xAxis);

      // Draw y axis
      svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('class', 'y-axis')
        .call(yAxis);

      // Draw heat cells
      parent
        .selectAll('.heat-cell')
        .data(dataArray)
        .enter()
        .append('rect')
        .attr('class', 'heat-cell')
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .attr('x', (d) => xScale(getWeekLabel(d.week)) ?? 0)
        .attr('y', (d) => yScale(dayLabels[d.day - 1]) ?? 0)
        .attr('fill', (d) => getColor(colorGenerator, d.total))
        .attr('stroke-width', 1)
        .attr(
          'pointer-events',
          (d) => (d.total === 0 ? 'none' : 'visiblePainted') // Ref: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pointer-events#usage_notes
        )
        .attr('stroke', ' var(--background_color)');

      // Add text color
      selectAll('.x-axis, .y-axis')
        .selectAll('text')
        .attr('fill', 'var(--primary_color)');

      // Add path color
      selectAll('.x-axis, .y-axis')
        .selectAll('path')
        .attr('stroke', 'var(--primary_color)');

      // Add event listner to rect cell
      selectAll<SVGRectElement, MonthOverviewDatum>('.heat-cell')
        .on('mouseover', (e: React.MouseEvent<SVGRectElement>, datum) => {
          select(e.currentTarget).attr('fill-opacity', 0.4);
          onTooltip?.({
            value: datum,
          });
        })
        .on('mousemove', (_e: React.MouseEvent<SVGRectElement>, datum) => {
          onTooltip?.({
            value: datum,
          });
        })
        .on('mouseout', (e: React.MouseEvent<SVGRectElement>) => {
          select(e.currentTarget).attr('fill-opacity', 1);
          onHideTooltip?.();
        })
        .on('click', (_e: React.MouseEvent<SVGRectElement>, datum) => {
          onCellClick?.(datum);
        });

      // Adding animation on mouseover to the labels
      select('.x-axis')
        .selectAll<SVGTextElement, string>('text')
        .on('mouseover', (_e: React.MouseEvent<SVGTextElement>, tickLabel) => {
          selectAll<SVGRectElement, MonthOverviewDatum>('.heat-cell')
            .filter((d) => getWeekLabel(d.week) !== tickLabel)
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 0.2);
        })
        .on('mouseout', () => {
          selectAll<SVGRectElement, MonthOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 1);
        });

      select('.y-axis')
        .selectAll<SVGTextElement, string>('text')
        .on('mouseover', (_e: React.MouseEvent<SVGTextElement>, tickLabel) => {
          selectAll<SVGRectElement, MonthOverviewDatum>('.heat-cell')
            .filter((d) => dayLabels[d.day - 1] !== tickLabel)
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 0.2);
        })
        .on('mouseout', () => {
          selectAll<SVGRectElement, MonthOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 1);
        });

      // Add resize listener
      resize = () => {
        if (ref.current !== null) {
          const [newXScale, newXAxis] = getXScaleAndAxis({
            labels: weekLabels,
            element: ref.current,
            margin,
            paddingInner: 0.2,
            response,
          });

          const [newYScale, newYAxis] = getYScaleAndAxis({
            labels: dayLabels,
            element: ref.current,
            margin,
            paddingInner: 0,
            response,
          });

          // Update X axis
          select<SVGGElement, unknown>('.x-axis')
            .call(newXAxis)
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

          // Update Y axis
          select<SVGGElement, unknown>('.y-axis')
            .call(newYAxis)
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

          // Update heat cells
          selectAll<SVGRectElement, MonthOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('width', newXScale.bandwidth())
            .attr('height', newYScale.bandwidth())
            .attr('x', (d) => newXScale(getWeekLabel(d.week)) ?? 0)
            .attr('y', (d) => newYScale(dayLabels[d.day - 1]) ?? 0);
        }
      };
      window.addEventListener('resize', resize);
    }
    return () => {
      if (resize !== undefined) {
        window.removeEventListener('resize', resize);
      }
      svg?.remove();
    };
  }, [color, data, onCellClick, onHideTooltip, onTooltip, response]);

  useEffect(() => {
    if (fade === true) {
      fadeAwayElements(['.heat-cell', '.x-axis', '.y-axis']).then(() => {
        onFadeComplete?.();
      }); // Pass array of selectors
    }
  }, [fade, onFadeComplete]);

  return (
    <div
      {...rest}
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        ...rest.style,
      }}
      ref={ref}
    />
  );
}
