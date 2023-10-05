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
import { useTraceQueryImpl } from '../trace-queries';
import { TraceQueryDefinition } from '../trace-queries';
import { useQuery } from '@tanstack/react-query';

jest.mock('../time-series-queries', () => ({
  useTimeSeriesQueries: jest.fn().mockImplementation(() => [{ data: MOCK_TIME_SERIES_DATA }]),
}));

// jest.mock('../trace-queries', () => ({
//   useTraceQueries: jest.fn().mockImplementation(() => [{ data: MOCK_TRACE_DATA }]),
// }));

jest.mock('../trace-queries', () => {
  const originalModule = jest.requireActual('../trace-queries');
  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    useTraceQueries: jest.fn().mockImplementation(() => [{ data: MOCK_TRACE_DATA }]),
  };
});

// jest.mock('../plugin-registry', () => ({
//   useListPluginMetadata: jest.fn().mockImplementation(() => ({
//     data: [
//       {
//         display: {
//           name: 'Prometheus Range Query',
//         },
//         kind: 'PrometheusTimeSeriesQuery',
//         pluginType: 'TimeSeriesQuery',
//       },
//       {
//         display: {
//           name: 'Tempo Empty Query {}',
//         },
//         kind: 'TempoTraceQuery',
//         pluginType: 'TraceQuery',
//       },
//     ],
//     isLoading: false,
//   })),
// }));

jest.mock('../plugin-registry', () => {
  const originalModule = jest.requireActual('../plugin-registry');
  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
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
  };
});




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

    // JZ test TimeSeriesQuery
    const { result } = renderHook(() => useDataQueries('TimeSeriesQuery'), {
      wrapper,
    });
    console.log("JZ result: ", JSON.stringify(result))
    expect(result.current.queryResults[0]?.data).toEqual(MOCK_TIME_SERIES_DATA);

    // // JZ test TraceQuery 
    const { result:traceResult } = renderHook(() => useDataQueries('TraceQuery'), {
      wrapper,
    });
    console.log("JZ traceResults: ", JSON.stringify(traceResult, null, 3))
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


// describe.only('useTraceQueryImpl', () => {
//   it('testing useTraceQueryImpl, should return Tempo traces', () => {

//     const queryDefinitions = [
//       {
//         kind: "TraceQuery",
//         spec: {
//           plugin: {
//             kind: "TemopoTraceQuery",
//             spec: {
//               query:'{}',
//             },
//           },
//         },
//       },
//     ]
//     const traceQueries = queryDefinitions.filter(
//       (definition) => definition.kind === 'TraceQuery'
//     ) as TraceQueryDefinition[];
//     const traceQuery = traceQueries[0] as TraceQueryDefinition

//     // LEFT OFF HERE OCT 4 , 2023 6:24 
//     useTraceQueryImpl(traceQuery); 
//  });



// JZ Creating an end to end test 
// 1) load Tracing Plugin to PluginRegistry 
// 2) load datasource into DataSourceStore 
// 3) fetch data from DataQueryPlugin 
// 3.1) DataQueryPlugin 
// ---- reads the dashboard defintions 
// ---- creates seperate arrays for different query types via .filter()
// ---- results are fetched on the seperate query arrays 
// ---- PrometheusTimeSeriesQuery === useTimeSeriesQueries(dashboardDefinitions) 
// ---- TempoTraceQuery === useTraceQueries(dashboardDefinitions)
test('useTraceQueryImpl', () => {
  const definitions = [
    {
      kind: 'TraceQuery',
      spec: {
        plugin: {
          kind: 'TempoTraceQuery', 
          spec: {
            query: '{}'
          }
        }
      },
    },
  ] as TraceQueryDefinition[];


  const { result } = renderHook(() => useTraceQueryImpl(definitions));
  expect(result).toBe('hello world')


  // JZ LEFT OFF HERE OCT 5, 2023 5PM
  function getTraceData() {

  }

  const queryKey = [definitions] as const
  const queryFn = () => {
    return getTraceData;
  }

  useQuery({
    queryKey: queryKey, 
    queryFn: queryFn, 
  })


})