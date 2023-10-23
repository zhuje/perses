import { DatasourcePlugin } from '@perses-dev/plugin-system';
import { searchTraces, queryTrace, searchAll, TempoClient } from '../model/tempo-client';
import { RequestHeaders } from '@perses-dev/core';

export interface HTTPProxy {
  kind: 'HTTPProxy';
  spec: HTTPProxySpec;
}
export interface HTTPProxySpec {
  // url is the url of the datasource. It is not the url of the proxy.
  // The Perses server is the proxy, so it needs to know where to redirect the request.
  url: string;
  // allowed_endpoints is a list of tuples of http methods and http endpoints that will be accessible.
  // Leave it empty if you don't want to restrict the access to the datasource.
  allowed_endpoints?: HTTPAllowedEndpoint[];
  // headers can be used to provide additional headers that need to be forwarded when requesting the datasource
  headers?: RequestHeaders;
  // secret is the name of the secret that should be used for the proxy or discovery configuration
  // It will contain any sensitive information such as password, token, certificate.
  secret?: string;
}

export interface HTTPAllowedEndpoint {
  endpoint_pattern: string;
  method: string;
}

export interface TempoDatasourceSpec {
    direct_url?: string;
    // add proxy options later -- see @perses-dev/prometheus-plugins/.../prometheusDatasourceSpec
    proxy?: HTTPProxy;
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
    searchAll: (query: string) => searchAll(query, datasourceUrl),
    searchTraces: (query: string) => searchTraces(query, datasourceUrl),
    queryTrace: (traceID: string) => queryTrace(traceID, datasourceUrl),
  };
};
  

export const TempoDatasource: DatasourcePlugin<TempoDatasourceSpec, TempoClient> = {
    createClient,
    createInitialOptions: () => ({ direct_url: '' }),
  };