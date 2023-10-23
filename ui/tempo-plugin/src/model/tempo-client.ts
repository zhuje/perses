import { fetch, RequestHeaders } from '@perses-dev/core';
import { QueryResponse, TraceData, SearchResult } from "./types";
import { DatasourceClient } from '@perses-dev/plugin-system';


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

/**
 * Create a search and query functions the Tempo client can perform. 
 */
export const executeRequest = async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
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

function fetchWithGet<TResponse>(apiURI: string,  datasourceUrl:string) {
    let url = `${datasourceUrl}${apiURI}`;
    return executeRequest<TResponse>(url)
}


// export function searchTracesQuery(q: string, datasourceUrl: string) {
//     return fetchWithGet(`tempo/api/search?=${q}`, datasourceUrl)
// }

 
export function searchTraces(query: string, datasourceUrl:string):Promise<TraceData> {
    // return await executeRequest(`/api/search?${new URLSearchParams({ q })}`);
    // console.log('JZ /proxy fetchWithGet', fetchWithGet(`/api/search?${query}`, datasourceUrl));
    // return await executeRequest(`tempo/api/search?=${query}`);
    return fetchWithGet<TraceData>(`/api/search?${query}`, datasourceUrl)
};

export function queryTrace (traceID: string, datasourceUrl: string) {
    // return executeRequest(`/api/traces/${traceID}`);
    return fetchWithGet<QueryResponse>(`/api/traces/${traceID}`, datasourceUrl)
};

// search and query all received traces
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







