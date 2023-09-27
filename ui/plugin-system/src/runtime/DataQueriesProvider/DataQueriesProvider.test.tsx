// Copyright 2023 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import { renderHook } from '@testing-library/react';
import { MOCK_TIME_SERIES_DATA, MOCK_TRACE_DATA } from '../../test';
import { useListPluginMetadata } from '../plugin-registry';
import { DataQueriesProvider, useDataQueries } from './DataQueriesProvider';
import { useQueryType } from './model';

jest.mock('../time-series-queries', () => ({
  useTimeSeriesQueries: jest.fn().mockImplementation(() => [{ data: MOCK_TIME_SERIES_DATA }]),
}));

jest.mock('../trace-queries', () => ({
  useTraceQueries: jest.fn().mockImplementation(() => [{ data: MOCK_TRACE_DATA }]),
}));

jest.mock('../plugin-registry', () => ({
  useListPluginMetadata: jest.fn().mockImplementation(() => ({
    data: [
      {
        display: {
          name: 'Prometheus Range Query',
        },
        kind: 'PrometheusTimeSeriesQuery',
        pluginType: 'TimeSeriesQuery',
      },
      {
        display: {
          name: 'Tempo Empty Query {}',
        },
        kind: 'TempoTraceQuery',
        pluginType: 'TraceQuery',
      },
    ],
    isLoading: false,
  })),
}));

describe('useDataQueries', () => {
  it('should return the correct data for TimeSeriesQuery and TraceQuery', () => {
    const definitions = [
      {
        kind: 'PrometheusTimeSeriesQuery',
        spec: {
          query: 'up',
        },
      },
      {
        kind: 'TempoTraceQuery',
        spec: {
          query: 'up',
        },
      },
    ];

    const wrapper = ({ children }: React.PropsWithChildren) => {
      return <DataQueriesProvider definitions={definitions}>{children}</DataQueriesProvider>;
    };

    //JZ test TimeSeriesQuery
    const { result } = renderHook(() => useDataQueries('TimeSeriesQuery'), {
      wrapper,
    });
    expect(result.current.queryResults[0]?.data).toEqual(MOCK_TIME_SERIES_DATA);

    // JZ test TraceQuery 
    const { result:traceResult } = renderHook(() => useDataQueries('TraceQuery'), {
      wrapper,
    });
    console.log('JZ Traceresults : ', JSON.stringify(traceResult, null, 3))
    expect(traceResult.current.queryResults[0]?.data).toEqual(MOCK_TRACE_DATA);
  });
});

describe('useQueryType', () => {
  it('should return the correct query type for a given plugin kind', () => {
    const { result } = renderHook(() => useQueryType());

    const getQueryType = result.current;
    // JZ NOTES: PrometheusTimeSeriesQuery is the plugin.kind, TimeSeriesQuery is the query.kind 
    // "queries": [
    //   {
    //     "kind": "TimeSeriesQuery",
    //     "spec": {
    //       "plugin": {
    //         "kind": "PrometheusTimeSeriesQuery",
    //         "spec": {
    //           "query": "rate(caddy_http_response_duration_seconds_sum[$interval])"
    //         }
    //       }
    //     }
    //   }
    expect(getQueryType('PrometheusTimeSeriesQuery')).toBe('TimeSeriesQuery');
    expect(getQueryType('TempoTraceQuery')).toBe('TraceQuery');
  });

  it('should throw an error if query type is not found ', () => {
    const { result } = renderHook(() => useQueryType());

    const getQueryType = result.current;
    expect(() => getQueryType('UnknownQuery')).toThrowError(`Unable to determine the query type: UnknownQuery`);
  });

  it('should return undefined if useLIstPluginMetadata is still loading', () => {
    (useListPluginMetadata as jest.Mock).mockReturnValue({ isLoading: true });
    const { result } = renderHook(() => useQueryType());

    const getQueryType = result.current;
    expect(getQueryType('UnknownQuery')).toBeUndefined();
  });
});
