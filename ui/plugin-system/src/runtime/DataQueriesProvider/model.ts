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

import { Definition, QueryDefinition, UnknownSpec, QueryDataType } from '@perses-dev/core';
import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useListPluginMetadata } from '../plugin-registry';
import { useState } from 'react';

type QueryOptions = Record<string, unknown>;
export interface DataQueriesProviderProps<QueryPluginSpec = UnknownSpec> {
  definitions: Array<Definition<QueryPluginSpec>>;
  children?: React.ReactNode;
  options?: QueryOptions;
  queryOptions?: QueryObserverOptions;
}

export interface DataQueriesContextType {
  queryResults: QueryData[];
  refetchAll: () => void;
  isFetching: boolean;
  isLoading: boolean;
  errors: unknown[];
}

export interface UseDataQueryResults<T> extends Omit<DataQueriesContextType, 'queryResults'> {
  queryResults: Array<QueryData<T>>;
}

export type QueryData<T = QueryDataType> = {
  data?: T;
  definition: QueryDefinition;
  error: unknown;
  isFetching: boolean;
  isLoading: boolean;
  refetch?: () => void;
};

export function transformQueryResults(results: UseQueryResult[], definitions: QueryDefinition[]) {
  return results.map(({ data, isFetching, isLoading, refetch, error }, i) => {
    return {
      definition: definitions[i],
      data,
      isFetching,
      isLoading,
      refetch,
      error,
    } as QueryData;
  });
}

/**
 * JZ NOTES: useQueryType returns a function `const getQueryType('PrometheusTimeSeriesQuery') returns 'TimeSeriesQuery'`. 
 * This function checks if the plugin.kind 'PrometheusTimeSeriesQuery' can be mapped to a query type 
 * @returns `const getQueryType('TempoTraceQuery') return 'TraceQuery'
 */
export function useQueryType(): (pluginKind: string) => string | undefined {

  // JZ NOTES: useListPluginMetaData uses usePluginRegistry to get a list of all available plugin types 
  // JZ Question: WHY?? Are we passing a pluginType? This parameter isn't passed and doesn't do any filtering
  // useListPluginMetadata(<pluginType) returns all plugins from the PluginRegistry regardless of param 
  // (e.g. 'TimeSeriesQuery', 'TraceQuery')
  const { data: timeSeriesQueryPlugins, isLoading } = useListPluginMetadata('TimeSeriesQuery');
  const { data: traceQueryPlugins, isLoading: isTraceQueryPluginLoading } = useListPluginMetadata('TraceQuery');

  // console.log("JZ timeSeriesQueryPlugins: ", timeSeriesQueryPlugins, "\n isloading: ", isLoading )
  // console.log("JZ traceQueryPlugins: ", traceQueryPlugins, "\n isloading: ", isTraceQueryPluginLoading )

  const queryTypeMap = useMemo(() => {
    // JZ NOTES: do we need to type this so strictly? can we just leave this empty
    // and build the map as we iterate through the queryPlugins in the next block? 
    const map: Record<string, string[]> = {
      TimeSeriesQuery: [],
      TraceQuery: [],
    };

    // JZ NOTES: create a map of key:pluginType value:pluginKind
    // (e.g. map: {"TimeSeriesQuery":["PrometheusTimeSeriesQuery"],"TraceQuery":["TempoTraceQuery"]} )
    if (timeSeriesQueryPlugins) {
      timeSeriesQueryPlugins.forEach((plugin) => {
        // console.log("JZ .forEach(plugin) -- plugin = ", plugin.pluginType)
        // console.log("JZ map[plugin.pluginType] -- ", map[plugin.pluginType])
        // map['TimeSeriesQuery']?.push(plugin.kind);
        map[plugin.pluginType]?.push(plugin.kind)
      });
    }

    return map;
  }, [timeSeriesQueryPlugins, traceQueryPlugins]);
  // console.log("JZ map: ", JSON.stringify(queryTypeMap))

  const getQueryType = useCallback(
    (pluginKind: string) => {
      if (isLoading) {
        return undefined;
      }

      for (const queryType in queryTypeMap) {
        if (queryTypeMap[queryType]?.includes(pluginKind)) {
          return queryType;
        }
      }

      throw new Error(`Unable to determine the query type: ${pluginKind}`);
    },
    [queryTypeMap, isLoading]
  );

  return getQueryType;
}
