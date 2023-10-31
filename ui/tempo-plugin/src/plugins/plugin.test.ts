import { DatasourceSpec, TraceData } from '@perses-dev/core';

jest.mock('echarts/core');

import { TraceQueryContext } from '@perses-dev/plugin-system';
import { TempoDatasourceSpec } from './tempo-datasource-types';
import { TempoDatasource } from './tempo-datasource';
import { TempoTraceQuery } from './TempoTraceQuery';

const datasource: TempoDatasourceSpec = {
  direct_url: '/test',
};

const tempoStubClient = TempoDatasource.createClient(datasource, {});

const MOCK_TRACE_DATA: TraceData = {
  traces: [
    {
      traceID: '0123456',
      rootServiceName: 'fooService',
      rootTraceName: 'fooTrace',
      startTimeUnixNano: '7890',
      durationMs: 1000,
      spanSets: {
        matched: 1,
        spans: [
          {
            spandID: '2345',
            startTimeUnixNano: '7891',
            durationNanos: '800',
            attributes: {
              key: 'fooSpanKey',
              value: {
                stringValue: 'fooStringvalue',
              },
            },
          },
        ],
      },
    },
  ],
};

tempoStubClient.searchTraces = jest.fn(async () => {
  const stubResponse: TraceData = MOCK_TRACE_DATA;
  return stubResponse;
});

const getDatasourceClient: jest.Mock = jest.fn(() => {
  return tempoStubClient;
});

const getDatasource: jest.Mock = jest.fn((): DatasourceSpec<TempoDatasourceSpec> => {
  return {
    default: false,
    plugin: {
      kind: 'TempoDatasource',
      spec: datasource,
    },
  };
});

const stubTempoContext: TraceQueryContext = {
  datasourceStore: {
    getDatasource: getDatasource,
    getDatasourceClient: getDatasourceClient,
    listDatasourceSelectItems: jest.fn(),
  },
};

describe('TempoTraceQuery', () => {
  it('should return trace results', async () => {
    const results = await TempoTraceQuery.getTraceData(
      {
        query: 'duration > 900ms',
      },
      stubTempoContext
    );
    expect(results).toEqual(MOCK_TRACE_DATA);
  });
});
