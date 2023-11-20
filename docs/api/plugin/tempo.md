# Tempo

This documentation is providing the definition of the different plugin related to Tempo.

## Datasource

```yaml
kind: "TempoDatasource"
spec: <tempo_plugin_spec>
```

### Plugin Specification

Tempo as a datasource is basically an HTTP server. So we need to define an HTTP config.

```yaml
  # It is the url of the datasource.
  # Leave it empty if you don't want to access the datasource directly from the UI.
  # You should define a proxy if you want to access the datasource through the Perses' server.
  [ directUrl: <url> ]

  # It is the http configuration that will be used by the Perses' server to redirect to the datasource any query sent by the UI.
  [ proxy: <http_proxy_spec> ]
  
```

#### `<http_proxy_spec>`

```yaml
kind: "HTTPProxy"
spec:
  # URL is the url of datasource. It is not the url of the proxy.
  url: <url>

  # It is a tuple list of http methods and http endpoints that will be accessible.
  # Leave it empty if you don't want to restrict the access to the datasource.
  allowedEndpoints:
    - [ <allowedEndpoints_spec> ]

  # It can be used to provide additional headers that need to be forwarded when requesting the datasource
  headers:
    [ <string>: <string> ]
  # This is the name of the secret that should be used for the proxy or discovery configuration
  # It will contain any sensitive information such as password, token, certificate.
  # Please read the documentation about secrets to understand how to create one
  [ secret: <string> ]
```

##### `<allowedEndpoints_spec>`

```yaml
endpointPattern: <RegExp>
method: <enum | possibleValue = 'POST' | 'PUT' | 'PATCH' | 'GET' | 'DELETE'>
```

### Example

A simple Prometheus datasource would be

```yaml
kind: "Datasource"
metadata:
  name: "PrometheusDemo"
  project: "perses"
spec:
  default: true
  plugin:
    kind: "PrometheusDatasource"
    spec:
      directUrl: "https://localhost:3200"
```

A more complex one:

```yaml
kind: "Datasource"
metadata:
  name: "PrometheusDemo"
  project: "perses"
spec:
  default: true
  plugin:
    kind: "PrometheusDatasource"
    spec:
      proxy:
        kind: "HTTPProxy"
        spec:
          url: "https://prometheus.demo.do.prometheus.io"
          allowedEndpoints:
            - endpointPattern: "/api/v1/labels"
              method: "POST"
            - endpointPattern: "/api/v1/series"
              method: "POST"
            - endpointPattern: "/api/v1/metadata"
              method: "GET"
            - endpointPattern: "/api/v1/query"
              method: "POST"
            - endpointPattern: "/api/v1/query_range"
              method: "POST"
            - endpointPattern: "/api/v1/label/([a-zA-Z0-9_-]+)/values"
              method: "GET"
          secret: "prometheus_secret_config"
```

## Query

We are only supporting one kind of query for Prometheus: `PrometheusTimeSeriesQuery`. Others will come in the future.

```yaml
kind: "PrometheusTimeSeriesQuery"
spec: <timeseries_query_spec>
```

### `<timeseries_query_spec>`

```yaml
  #`query` is the promQL expression.
  query: <string>

  # `datasource` is a datasource selector. If not provided, the default PrometheusDatasource is used.
  # See the documentation about the datasources to understand how it is selected.
  [ datasource: <datasource_selector> ]
  [ seriesNameFormat: <string> ]

  # `minStep` is the minimum time interval you want between each data points.
  [ minStep: <duration> ]
  [ resolution: number ]
```

#### Example

A simple one:

```yaml
kind: "TimeSeriesQuery"
spec:
  plugin:
    kind: "PrometheusTimeSeriesQuery"
    spec:
      query: "rate(caddy_http_response_duration_seconds_sum[$interval])"
```

