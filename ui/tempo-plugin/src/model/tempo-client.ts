import { fetch, RequestHeaders } from '@perses-dev/core';
import { QueryResponse, SearchResponse, SearchResult } from "./types";
import { DatasourceClient } from '@perses-dev/plugin-system';
import { QueryOptions } from '@perses-dev/prometheus-plugin';

interface TempoClientOptions {
    datasourceUrl: string;
    headers?: RequestHeaders;
}

export interface TempoClient extends DatasourceClient {
    options: TempoClientOptions;
    searchAll(query: string) : Promise<SearchResult>;
    searchTraces(query: string, datasourceUrl:string) : Promise<SearchResponse>;
    queryTrace(traceID: string) : Promise<QueryResponse>;
}

/**
 * Create a search and query functions the Tempo client can perform. 
 */
export const executeRequest = async <T>(url: string): Promise<T> => {
    console.log("JZ traceImpl > tempo-plugin > executeRequest url :", url);
    const response = await fetch(url);
    console.log("JZ traceImpl > tempo-plugin > executeRequest >  response :", response);
    const jsonData = await response.json();
    console.log("JZ traceImpl > tempo-plugin > executeRequest >  jsonData :", jsonData);

    return jsonData;
};

/**
 * This interface is based on TempoAPI : https://grafana.com/docs/tempo/latest/api_docs/#search
 * @param start, end:  need to be in unix epoch seconds 
 * @param query: needs to be written TraceQueryLanguage (TraceQL) for API to consume it 
 */
export interface SearchTracesQuery{
    query: string;
    limit?: number;
    start?: number;
    end?: number;
}

function fetchWithGet(apiURI: string,  datasourceUrl:string) {
    let url = `${datasourceUrl}${apiURI}`;
    executeRequest(url)
}


export function searchTracesQuery(q: string, datasourceUrl: string) {
    return fetchWithGet(`tempo/api/search?=${q}`, datasourceUrl)
}

 
export const searchTraces = async (query: string, datasourceUrl:string): Promise<SearchResponse> => {
    // return await executeRequest(`/api/search?${new URLSearchParams({ q })}`);
    console.log('JZ /proxy fetchWithGet', fetchWithGet(`/api/search?${query}`, datasourceUrl));
    return await executeRequest(`tempo/api/search?=${query}`);
};

export const queryTrace = async (traceID: string): Promise<QueryResponse> => {
    return executeRequest(`/api/traces/${traceID}`);
};

// search and query all received traces
export const searchAll = async (query: string): Promise<SearchResult> => {
    const searchResponse = await searchTraces(query);
    if (!searchResponse.traces) {
        return { query, traces: [] };
    }

    return {
        query,
        traces: await Promise.all(searchResponse.traces.map(async trace => ({
            summary: trace,
            trace: await queryTrace(trace.traceID)
        }))),
    }
};





