import { TempoDatasourceSelector } from './tempo-selectors';
/**
 * The spec/options for the TempoTraceQuery plugin.
 */
export interface TempoTraceQuerySpec {
  query: string;
  datasource?: TempoDatasourceSelector;
}
