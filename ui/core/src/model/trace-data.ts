// source: https://grafana.com/docs/tempo/latest/api_docs/#search

export interface TraceData {
    traces: Trace[];
}

export interface Trace {
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
