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