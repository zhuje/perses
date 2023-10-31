import { Trace, Spans } from '@perses-dev/core';

export interface Attribute {
  key: string;
  value: {
    stringValue: string;
  };
}

export interface Batch {
  resource: {
    attributes: Attribute[];
  };
  scopeSpans: {
    scope: {
      name: string;
    };
    spans: Spans[];
  };
}

export interface QueryResponse {
  batches: Batch[];
}

export interface SearchResult {
  query: string;
  traces: Array<{
    summary: Trace;
    stats?: {
      spans: number;
      errors: number;
    };
  }>;
}
