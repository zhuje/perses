import { Trace } from "@perses-dev/core";

export interface QueryResponse {
    batches: any;
}

export interface SearchResult {
    query: string;
    traces: {
        summary: Trace,
        stats?: {
            spans: number,
            errors: number,
        }
    }[];
}
