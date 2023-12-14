// import { TimeSeriesQueryDefinition } from '@perses-dev/core';

import { UnknownSpec, QueryDefinition } from '@perses-dev/core';

  // TODO: need to update ScatterChartOptions and createInitialScatterChartOptions
  // to be more generalied to work with any queryType 
  export type TraceQueryDefinition<PluginSpec = UnknownSpec> = QueryDefinition<'TraceQuery', PluginSpec>;


/**
 * The Options object type supported by the ScatterChart panel plugin.
 */
export interface ScatterChartOptions {
  query: TraceQueryDefinition 
}

/**
 * Creates the initial/empty options for a ScatterChart panel.
 */
export function createInitialScatterChartOptions(): ScatterChartOptions {
  return {
    query: {
      kind: 'TraceQuery',
      spec: {
        plugin: {
          kind: 'TempoTraceQuery',
          spec: {
            query: '{}',
          },
        },
      },
    },
  };
}
