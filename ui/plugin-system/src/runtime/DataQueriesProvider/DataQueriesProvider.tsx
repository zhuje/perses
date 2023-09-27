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

import { createContext, useCallback, useContext, useMemo } from 'react';
import { QueryType, TimeSeriesQueryDefinition } from '@perses-dev/core';
import { useTimeSeriesQueries } from '../time-series-queries';
import {
  DataQueriesProviderProps,
  UseDataQueryResults,
  transformQueryResults,
  DataQueriesContextType,
  QueryData,
  useQueryType,
} from './model';
import { UnknownSpec } from '@perses-dev/core';
import { QueryDefinition } from '@perses-dev/core';
import { UseQueryResult } from '@tanstack/react-query';
import { useTraceQueries } from '../trace-queries';

export const DataQueriesContext = createContext<DataQueriesContextType | undefined>(undefined);

export function useDataQueriesContext() {
  const ctx = useContext(DataQueriesContext);
  if (ctx === undefined) {
    throw new Error('No DataQueriesContext found. Did you forget a Provider?');
  }
  return ctx;
}

// JZ NOTES: 'QueryType' also is hardcoded -- defines expected model for response data 
export function useDataQueries<T extends keyof QueryType>(queryType: T): UseDataQueryResults<QueryType[T]> {
  const ctx = useDataQueriesContext();

  // Filter the query results based on the specified query type
  const filteredQueryResults = ctx.queryResults.filter(
    (queryResult) => queryResult.definition.kind === queryType
  ) as Array<QueryData<QueryType[T]>>;

  // Filter the errors based on the specified query type
  const filteredErrors = ctx.errors.filter((errors, index) => ctx.queryResults[index]?.definition.kind === queryType);

  // Create a new context object with the filtered results and errors
  const filteredCtx = {
    queryResults: filteredQueryResults,
    isFetching: filteredQueryResults.some((result) => result.isFetching),
    isLoading: filteredQueryResults.some((result) => result.isLoading),
    refetchAll: ctx.refetchAll,
    errors: filteredErrors,
  };

  return filteredCtx;
}

type TraceQueryDefinition<PluginSpec = UnknownSpec> = QueryDefinition<'TraceQuery', PluginSpec>;

const jsonPrint = (obj:{}) => {
  return JSON.stringify(obj, null, 3)
}

export function DataQueriesProvider(props: DataQueriesProviderProps) {
  // JZ NOTES: Defintions are dashboard Defintions 
  // {
  //   kind: 'PrometheusTimeSeriesQuery',
  //   spec: {
  //     query: 'up',
  //   },
  // },
  // {
  //   kind: 'TempoTraceQuery',
  //   spec: {
  //     query: 'up',
  //   },
  // },
  const { definitions, options, children, queryOptions } = props;


  // JZ NOTES: Returns a map of key: QueryTypes, Value: pluginTypes
  // map:  {
  //   TimeSeriesQuery: [ 'PrometheusTimeSeriesQuery' ],
  //   TraceQuery: [ 'TempoTraceQuery' ]
  // }
  const getQueryType = useQueryType();


  // JZ Notes: Create a new map of all the dashboard defintions 
  // JZ QUESTION: Aren't we already formatting the dashboard defintions like this?
  // Seems like we're duplicating data...
  // {
  //   kind: "TimeSeriesQuery",
  //   spec: {
  //     plugin: {
  //       kind: "PrometheusTimeSeriesQuery",
  //       spec: {
  //         query:
  //           'node_load1{instance=~"(demo.do.prometheus.io:9100)"}',
  //         series_name_format: "job - {{job}}, {{env}} {{instance}}",
  //       },
  //     },
  //   },
  // },
  const queryDefinitions = definitions.map((definition) => {
    const type = getQueryType(definition.kind);
    console.log("JZ defintion = ", definition)
    console.log("JZ type = ",  JSON.stringify({
      kind: type,
      spec: {
        plugin: definition,
      }}, null, 3 ))
    return {
      kind: type,
      spec: {
        plugin: definition,
      },
    };
  });

  // Filter definitions for time series query and other future query plugins
  const timeSeriesQueries = queryDefinitions.filter(
    (definition) => definition.kind === 'TimeSeriesQuery'
  ) as TimeSeriesQueryDefinition[];
  const timeSeriesResults = useTimeSeriesQueries(timeSeriesQueries, options, queryOptions);

  // console.log("JZ TimeSeriesQueries : ", JSON.stringify(timeSeriesQueries));
  //     JZ TimeSeriesQueries :  [{"kind":"TimeSeriesQuery","spec":{"plugin":{"kind":"PrometheusTimeSeriesQuery","spec":{"query":"up"}}}}]
  // console.log("JZ timeSeriesResults : ", timeSeriesResults);
  //     JZ TimeSeriesQueries :  [ { data: { timeRange: [Object], stepMs: 24379, series: [Array] } } ]

  // JZ NOTES -- filter for TraceQueries and fetch TemoData from traceQueries
  // MOCKED right now for testing 
  const traceQueries = queryDefinitions.filter(
    (definition) => definition.kind === 'TraceQuery'
  ) as TraceQueryDefinition[];
  // console.log("JZ TraceQuery : ", JSON.stringify(traceQueries));
  const traceResults = useTraceQueries() as UseQueryResult[] 


  const refetchAll = useCallback(() => {
    timeSeriesResults.forEach((result) => result.refetch());
    traceResults;
  }, [timeSeriesResults]);

  const allResults = [...timeSeriesResults, ...traceResults];
  const allQueries =[...timeSeriesQueries, ...traceQueries];

  const ctx = useMemo(() => {
    const mergedQueryResults = [...transformQueryResults(allResults, allQueries)];
    // console.log("JZ mergeQueryResults : ", jsonPrint(mergedQueryResults))
    //   JZ mergeQueryResults :  [
    //     {
    //        "definition": {
    //           "kind": "TimeSeriesQuery",
    //           "spec": {
    //              "plugin": {
    //                 "kind": "PrometheusTimeSeriesQuery",
    //                 "spec": {
    //                    "query": "up"
    //                 }
    //              }
    //           }
    //        },
    //        "data": {
    //           "timeRange": {
    //              "start": "2022-10-24T15:31:30.000Z",
    //              "end": "2022-10-24T15:32:15.000Z"
    //           },
    //           "stepMs": 24379,
    //           "series": [
    //              {
    //                 "name": "device=\"/dev/vda1\", env=\"demo\", fstype=\"ext4\", instance=\"demo.do.prometheus.io:9100\", job=\"node\", mountpoint=\"/\"",
    //                 "values": [
    //                    [
    //                       1666479357903,
    //                       0.27700745551584494
    //                    ],
    //                    [
    //                       1666479382282,
    //                       0.27701284657366565
    //                    ]
    //                 ]
    //              },
    //              {
    //                 "name": "device=\"/dev/vda15\", env=\"demo\", fstype=\"vfat\", instance=\"demo.do.prometheus.io:9100\", job=\"node\", mountpoint=\"/boot/efi\"",
    //                 "values": [
    //                    [
    //                       1666479357903,
    //                       0.08486496097624885
    //                    ],
    //                    [
    //                       1666479382282,
    //                       0.08486496097624885
    //                    ]
    //                 ]
    //              }
    //           ]
    //        }
    //     },
    //     {
    //        "definition": {
    //           "kind": "TraceQuery",
    //           "spec": {
    //              "plugin": {
    //                 "kind": "TempoTraceQuery",
    //                 "spec": {
    //                    "query": "up"
    //                 }
    //              }
    //           }
    //        },
    //        "data": {
    //           "traceID": "1234",
    //           "rootServiceName": "fooServiceName",
    //           "rootTraceName": "barTraceName",
    //           "startTimeUnixNano": "5678",
    //           "durationMs": "90"
    //        }
    //     }
    //  ]

    return {
      queryResults: mergedQueryResults,
      isFetching: mergedQueryResults.some((result) => result.isFetching),
      isLoading: mergedQueryResults.some((result) => result.isLoading),
      refetchAll,
      errors: mergedQueryResults.map((result) => result.error),
    };
  }, [timeSeriesQueries, timeSeriesResults, refetchAll]);

  return <DataQueriesContext.Provider value={ctx}>{children}</DataQueriesContext.Provider>;
}
