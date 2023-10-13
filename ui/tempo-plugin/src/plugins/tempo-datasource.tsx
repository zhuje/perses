import { DatasourcePlugin } from '@perses-dev/plugin-system';
import { searchTraces, queryTrace, searchAll, TempoClient } from '../model/tempo-client';

export interface TempoDatasourceSpec {
    direct_url?: string;
    // add proxy options later -- see @perses-dev/prometheus-plugins/.../prometheusDatasourceSpec
    // proxy?: HTTPProxy;
}

/**
 * Creates a Tempo for a specific datasource spec.
 */
const createClient: DatasourcePlugin<TempoDatasourceSpec, TempoClient>['createClient'] = (spec, options) => {
  const { direct_url } = spec;
  const { proxyUrl } = options;

  // Use the direct URL if specified, but fallback to the proxyUrl by default if not specified
  const datasourceUrl = direct_url ?? proxyUrl;
  if (datasourceUrl === undefined) {
    throw new Error('No URL specified for Prometheus client. You can use direct_url in the spec to configure it.');
  }

  return {
    options: {
      datasourceUrl,
    },
    searchAll: (query: string) => searchAll(query),
    searchTraces: (query: string) => searchTraces(query),
    queryTrace: (traceID: string) => queryTrace(traceID),
  };
};
  

export const TempoDatasource: DatasourcePlugin<TempoDatasourceSpec, TempoClient> = {
    createClient,
    createInitialOptions: () => ({ direct_url: '' }),
  };