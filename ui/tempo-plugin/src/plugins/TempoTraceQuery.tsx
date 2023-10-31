import { getTraceData } from "./get-trace-data";

/**
 * The core Tempo TraceQuery plugin for Perses.
 */
export const TempoTraceQuery = {
  getTraceData, 
  createInitialOptions: () => ({
    query: '{}',
    datasource: undefined,
  }),
};
