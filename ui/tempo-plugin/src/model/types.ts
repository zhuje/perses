export interface TraceSummary {
    traceID: string
    rootServiceName: string
    rootTraceName: string
    startTimeUnixNano: string
    durationMs: number
}

export interface SearchResponse {
    traces?: TraceSummary[];
}

export interface QueryResponse {
    batches: any;
}

export interface SearchResult {
    /** the query which produced the search response */
    query: string;
    traces: {
        summary: TraceSummary,
        stats?: {
            spans: number,
            errors: number,
        }
    }[];
}
