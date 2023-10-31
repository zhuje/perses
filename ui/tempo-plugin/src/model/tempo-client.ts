import { fetch, RequestHeaders } from '@perses-dev/core';
import { QueryResponse, SearchResult } from "./types";
import { DatasourceClient } from '@perses-dev/plugin-system';
import { TraceData } from '@perses-dev/core';

interface TempoClientOptions {
    datasourceUrl: string;
    headers?: RequestHeaders;
}

export interface TempoClient extends DatasourceClient {
    options: TempoClientOptions;
    searchAll(query: string, datasourceUrl:string) : Promise<SearchResult>;
    searchTraces(query: string, datasourceUrl:string) : Promise<TraceData>;
    queryTrace(traceID: string, datasourceUrl:string) : Promise<QueryResponse>;
}
export const executeRequest = async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
};

function fetchWithGet<TResponse>(apiURI: string,  datasourceUrl:string) {
    let url = `${datasourceUrl}${apiURI}`;
    return executeRequest<TResponse>(url)
}

export function searchTraces(query: string, datasourceUrl:string):Promise<TraceData> {
    return fetchWithGet<TraceData>(`/api/search?q=${query}`, datasourceUrl)
};

export function queryTrace (traceID: string, datasourceUrl: string) {
    return fetchWithGet<QueryResponse>(`/api/traces/${traceID}`, datasourceUrl)
};

export async function searchAll(query: string, datasourceUrl: string){
    const searchResponse = await searchTraces(query, datasourceUrl);
    if (!searchResponse.traces) {
        return { query, traces: [] };
    }

    return {
        query,
        traces: await Promise.all(searchResponse.traces.map(async trace => ({
            summary: trace,
            trace: await queryTrace(trace.traceID, datasourceUrl)
        }))),
    }
};







