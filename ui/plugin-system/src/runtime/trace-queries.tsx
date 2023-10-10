import { QueryDefinition, UnknownSpec } from "@perses-dev/core";
import { usePlugin } from "./plugin-registry";
import { useDatasourceStore } from "./datasources";
import { useQuery } from "@tanstack/react-query";
import { UseQueryResult } from "@tanstack/react-query";

export type TraceQueryDefinition<PluginSpec = UnknownSpec> = QueryDefinition<'TraceQuery', PluginSpec>;
export const TRACE_QUERY_KEY = 'TraceQuery';

// JZ NOTES: TODO -- currently for testing 
export function useMockTraceQueries() {
    return [
        { 
            data :  {
                traceID: "0987",
                rootServiceName: "fooServiceName",
                rootTraceName: "barTraceName",
                startTimeUnixNano: "5678",
                durationMs: "90",
            }
        }
    ] as UseQueryResult[];
}


// TODO: LEFT OFF HERE need to test -- refer to useTimeSeriesQuery testing 
/**
 * Run a trace query using a plugin and return the results 
 * @param definition: dashboard defintion for a trace query
 */
export function useTraceQueries (
    definitions: TraceQueryDefinition[],
) {

    // JZ NOTES: test only one defintion for now 
    const definition = definitions[0] as TraceQueryDefinition;

    console.log('JZ traceImpl Definition : ', definition)

    // JZ NOTEs: TODO: replace this mock when loading Plugin
    // Need to find where the dynamicPluginLoader is located for the 
    // local demo application. 
    

   // Get Trace Plugin 
    const { data: plugin } = usePlugin(TRACE_QUERY_KEY, definition.spec.plugin.kind);

    console.log("JZ traceImpl useTraceQueryImpl: plugin " , plugin)

    // Get datasource 
    const datasourceStore = useDatasourceStore();

    // Create a context for the query, this includes the datasource but 
    // also other variables, which at this time are removed for simplicity.
    const ctx = {
        datasourceStore
    }

    // queryKey is a required parameter for useQuery
    const queryKey = [definition, datasourceStore] as const; 

    // queryFn is a required parameter for useQuery 
    const queryFn = ()=> {
        if (plugin === undefined) {
            throw new Error('Expected plugin to be loaded');
        }
        return plugin.getTraceData(definition.spec.plugin.spec, ctx)
    }

    // get response using React useQuery to handle fetching  
    return useQuery({
        queryKey: queryKey, 
        queryFn: queryFn, 
    })
}

    

