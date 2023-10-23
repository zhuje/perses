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

import { Query, QueryKey } from '@tanstack/react-query';
import { UnknownSpec } from '@perses-dev/core';
import { DatasourceStore, VariableStateMap } from '../runtime';
import { Plugin } from './plugin-base';
// import { TraceData } from '@perses-dev/core';

/**
 * JZ NOTE: TraceData -- current model for response from Tempo API 
 * TimeSeriesData, Traces, Spans interfaces should be moved to @perse/dev/ui/core/src/model/trace-data.ts 
 * to follow precedence of TimeSeriesData but leaving these interfaces here for now -- for easy of file managment.
 * ** FAILED ** can't get '@perses-dev/core' to export `trace-data.ts`. Ran `npm build` on both /core and /plugin-systems. 
 * \-____-\
 */
export interface TraceData {
    traces: Traces[];
}

export interface Traces {
    traceID: string; 
    rootServiceName: string; 
    rootTraceName: string; 
    startTimeUnixNano: string; 
    durationMs: number; 
    spanSets?: {
        matched: number; 
        spans: Spans[]; 
    }
}

export interface Spans {
    spandID: string; 
    startTimeUnixNano: string; 
    durationNanos: string; 
    attributes: {
        key: string 
        value: {
            stringValue: string;
        }
    }   
}

/**
 * A plugin for running time series queries.
 */
export interface TraceQueryPlugin<Spec = UnknownSpec> extends Plugin<Spec> {
  getTraceData: (spec: Spec, ctx: TraceQueryContext) => Promise<TraceData>;
}

/**
 * Context available to TraceQuery plugins at runtime.
 */
export interface TraceQueryContext {
  datasourceStore: DatasourceStore;
}

export type TraceDataQuery = Query<TraceData, unknown, TraceData, QueryKey>;
