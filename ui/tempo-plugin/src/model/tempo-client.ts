import { fetch, RequestHeaders } from '@perses-dev/core';
import { DatasourceClient } from '@perses-dev/plugin-system';
import { QueryResponse, SearchResponse, SearchResult } from "./types";

/**
 * Create a search and query functions the Tempo client can perform. 
 */

const TEMPO_ENDPOINT = 'http://localhost:3005';

export const executeRequest = async <T>(url: string): Promise<T> => {
    console.log("fetching", url);
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
};

export const searchTraces = async (q: string): Promise<SearchResponse> => {
    return await executeRequest(`${TEMPO_ENDPOINT}/api/search?${new URLSearchParams({ q })}`);
};

export const queryTrace = async (traceID: string): Promise<QueryResponse> => {
    return executeRequest(`${TEMPO_ENDPOINT}/api/traces/${traceID}`);
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

interface TempoClientOptions {
    datasourceUrl: string;
    headers?: RequestHeaders;
  }

export interface TempoClient extends DatasourceClient {
    options: TempoClientOptions;
    searchAll(query: string) : Promise<SearchResult>;
    searchTraces(query: string) : Promise<SearchResponse>;
    queryTrace(traceID: string) : Promise<QueryResponse>;
}

