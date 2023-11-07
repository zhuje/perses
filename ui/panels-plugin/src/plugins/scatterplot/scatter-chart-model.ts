import { TimeSeriesQueryDefinition } from '@perses-dev/core';

/**
 * The Options object type supported by the ScatterChart panel plugin.
 */
export interface ScatterChartOptions {
  query: TimeSeriesQueryDefinition;
}

/**
 * Creates the initial/empty options for a ScatterChart panel.
 */
export function createInitialScatterChartOptions(): ScatterChartOptions {
  return {
    query: {
      kind: 'TimeSeriesQuery',
      spec: {
        plugin: {
          kind: 'PrometheusTimeSeriesQuery',
          spec: {
            query: 'up',
          },
        },
      },
    },
  };
}
