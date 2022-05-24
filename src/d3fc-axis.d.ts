declare module '@d3fc/d3fc-axis' {
  import type { AxisDomain, AxisScale, Axis, Selection, BaseType } from 'd3';

  export type Decorator = (
    container: Selection<BaseType, unknown, BaseType, unknown>,
    data?: unknown,
    index?: number
  ) => Selection<BaseType, unknown, BaseType, unknown>; // Loosely based on Ref: https://github.com/d3fc/d3fc/blob/master/packages/d3fc-chart/src/cartesian.d.ts#L38

  export interface D3FCAxis<Domain extends AxisDomain> extends Axis<Domain> {
    decorate: (decorator: Decorator) => D3FCAxis<Domain>;
    tickCenterLabel: (center: boolean) => D3FCAxis<Domain>;
  }

  export function axisLeft<Domain extends AxisDomain>(
    scale: AxisScale<Domain>
  ): D3FCAxis<Domain>;

  export function axisTop<Domain extends AxisDomain>(
    scale: AxisScale<Domain>
  ): D3FCAxis<Domain>;

  export function axisBottom<Domain extends AxisDomain>(
    scale: AxisScale<Domain>
  ): D3FCAxis<Domain>;

  export function axisLabelRotate<Domain extends AxisDomain>(
    axis: Axis<Domain>
  ): D3FCAxis<Domain>;

  export function axisLabelOffset<Domain extends AxisDomain>(
    axis: Axis<Domain>
  ): D3FCAxis<Domain>;
}
