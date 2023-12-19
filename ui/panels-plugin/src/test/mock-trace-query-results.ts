import { TraceData } from "@perses-dev/core";


/**
 * Mock data we get from getTraceData() in @perses/tempo-plugin. 
 */
export const MOCK_TRACE_DATA: TraceData = {
    traces: [
        {
            startTimeUnixMs: 1702915645000, // unix epoch time in milliseconds
            durationMs: 100,
            spanCount: 10,
            errorCount: 0,
            traceId: '123',
            name: 'mock-trace-service-name'
        }
    ],
    metadata: {
        executedQueryString: '{duration > 500ms}',
    }
  };

  export const MOCK_EMPTY_TRACE_DATA: TraceData = {
    traces: [],
    metadata: {
        executedQueryString: '{duration > 500ms}',
    }
  };

  /**
   * Mocks results obtained from useTraceQueries() in @perses/plugin-system/runtime.
   * This function uses then React TanStack function useQueries(fooQuery) to 
   * handle fetching from the TempoAPI. 
   */
  export const MOCK_TRACE_QUERY_RESULT = [
    {
      status: 'success',
      fetchStatus: 'idle',
      isLoading: false,
      isSuccess: true,
      isError: false,
      data: MOCK_TRACE_DATA,
      dataUpdatedAt: 1666500979895,
      error: null,
      errorUpdatedAt: 0,
      failureCount: 0,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetchError: false,
      isStale: true,
    },
  ];

  export const MOCK_EMPTY_TRACE_QUERY_RESULT = [
    {
      status: 'success',
      fetchStatus: 'idle',
      isLoading: false,
      isSuccess: true,
      isError: false,
      data: MOCK_EMPTY_TRACE_DATA,
      dataUpdatedAt: 1666500979895,
      error: null,
      errorUpdatedAt: 0,
      failureCount: 0,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetchError: false,
      isStale: true,
    },
  ];
  