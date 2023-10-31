import { DatasourcePlugin } from '@perses-dev/plugin-system';
import { searchTraces, queryTrace, searchAll, TempoClient } from '../model/tempo-client';
import { TempoDatasourceSpec } from './tempo-datasource-types';

/**
 * Creates a TempoClient for a specific datasource spec.
 */
const createClient: DatasourcePlugin<TempoDatasourceSpec, TempoClient>['createClient'] = (spec, options) => {
  const { direct_url } = spec;
  const { proxyUrl } = options;

  // Use the direct URL if specified, but fallback to the proxyUrl by default if not specified
  const datasourceUrl = direct_url ?? proxyUrl;
  if (datasourceUrl === undefined) {
    throw new Error('No URL specified for Tempo client. You can use direct_url in the spec to configure it.');
  }

  return {
    options: {
      datasourceUrl,
    },
    searchAll: (query: string) => searchAll(query, datasourceUrl),
    searchTraces: (query: string) => searchTraces(query, datasourceUrl),
    queryTrace: (traceID: string) => queryTrace(traceID, datasourceUrl),
  };
};
  

export const TempoDatasource: DatasourcePlugin<TempoDatasourceSpec, TempoClient> = {
    createClient,
    // TODO add a options editor component for tempo datasource
    // OptionsEditorComponent: TempoDatasourceEditor,
    createInitialOptions: () => ({ direct_url: '' }),
  };