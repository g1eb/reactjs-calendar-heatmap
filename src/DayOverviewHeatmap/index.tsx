import { easeLinear, range, select, selectAll } from 'd3';
import { useEffect, useRef } from 'react';
import {
  createColorGenerator,
  fadeAwayElements,
  getXScaleAndAxis,
  getYScaleAndAxis,
} from '../utils';
import { createXAxisLabel, getDayData } from './utils';
import type { Margin } from '../utils';
import type { DayOverviewHeatmapProps, DayOverviewDatum } from './utils';
import type { Selection } from 'd3';

/**
 * Ref: https://bl.ocks.org/Bl3f/cdb5ad854b376765fa99
 * @param param0
 * @returns
 */
export function DayOverviewHeatMap({
  data,
  color,
  onTooltip,
  onHideTooltip,
  onCellClick,
  fade,
  onFadeComplete,
  response,
  ...rest
}: DayOverviewHeatmapProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const margin: Margin = { top: 50, bottom: 50, left: 50, right: 50 };

    let svg: Selection<SVGSVGElement, unknown, null, undefined> | undefined =
      undefined;
    let resize: (() => void) | undefined = undefined;
    if (
      ref.current !== null &&
      Array.isArray(data.details) &&
      data.details?.length > 0
    ) {
      // Create array day data and max and min value of the whole day.
      const { dataArray, valueExtent } = getDayData(data);
      const binCountPerHour = Math.ceil((data.details.length ?? 0) / 24);
      const hourLabels = range(0, 24).map((e) => `${e}h`);
      const xAxisLabels = range(0, binCountPerHour).map((e) =>
        createXAxisLabel(e)
      );

      // Calculate min and max value of all the day in the dataset
      const [minValue, maxValue] = valueExtent;

      // Generates color generator function
      const colorGenerator = createColorGenerator(minValue, maxValue, color);
      // X Scale and X Axis
      const [xScale, xAxis] = getXScaleAndAxis({
        labels: xAxisLabels,
        element: ref.current,
        margin,
        paddingInner: 0,
        response,
      });
      // Y Scale and Y Axis
      const [yScale, yAxis] = getYScaleAndAxis({
        labels: hourLabels,
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

      // Draw parent 'g' tag
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
        .attr('x', (d) => {
          return xScale(createXAxisLabel(d.col)) ?? 0;
        })
        .attr('y', (d) => {
          return yScale(hourLabels[d.hour]) ?? 0;
        })
        .attr('fill', (d) => {
          const color = Number.isFinite(d.value)
            ? colorGenerator(d.value)
            : 'none';
          return color;
        })
        .attr('stroke-width', 1);

      // Add hover and click listner to heat cell
      selectAll<SVGRectElement, DayOverviewDatum>('.heat-cell')
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
          selectAll<SVGRectElement, DayOverviewDatum>('.heat-cell')
            .filter((d) => createXAxisLabel(d.col) !== tickLabel)
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 0.2);
        })
        .on('mouseout', () => {
          selectAll<SVGRectElement, DayOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 1);
        });

      select('.y-axis')
        .selectAll<SVGTextElement, string>('text')
        .on('mouseover', (_e: React.MouseEvent<SVGTextElement>, tickLabel) => {
          selectAll<SVGRectElement, DayOverviewDatum>('.heat-cell')
            .filter((d) => hourLabels[d.hour] !== tickLabel)
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 0.2);
        })
        .on('mouseout', () => {
          selectAll<SVGRectElement, DayOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('fill-opacity', 1);
        });

      // Add resize listener
      resize = () => {
        if (ref.current !== null) {
          const [newXScale, newXAxis] = getXScaleAndAxis({
            labels: xAxisLabels,
            element: ref.current,
            margin,
            paddingInner: 0,
            response,
          });

          const [newYScale, newYAxis] = getYScaleAndAxis({
            labels: hourLabels,
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
          selectAll<SVGRectElement, DayOverviewDatum>('.heat-cell')
            .transition()
            .duration(500)
            .ease(easeLinear)
            .attr('width', newXScale.bandwidth())
            .attr('height', newYScale.bandwidth())
            .attr('x', (d) => {
              return newXScale(createXAxisLabel(d.col)) ?? 0;
            })
            .attr('y', (d) => {
              return newYScale(hourLabels[d.hour]) ?? 0;
            });
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
    // Fade away heat cells, x and y axis
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
