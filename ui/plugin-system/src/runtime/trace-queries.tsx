import { QueryDefinition, UnknownSpec, DatasourceSelector } from "@perses-dev/core";
import { usePlugin } from "./plugin-registry";
import { useDatasourceStore } from "./datasources";
import { useQuery } from "@tanstack/react-query";
import { UseQueryResult } from "@tanstack/react-query";
import { usePluginRegistry } from "./plugin-registry";
import { TraceData } from "@perses-dev/core";

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

export function useTraceQueryContext() {
    const datasourceStore = useDatasourceStore();
}

export const TEMPO_DATASOURCE_KIND = 'TempoDatasource' as const;
export interface TempoDatasourceSelector extends DatasourceSelector {
    kind: typeof TEMPO_DATASOURCE_KIND;
  }
export const DEFAULT_TEMPO: TempoDatasourceSelector = { 
    kind: TEMPO_DATASOURCE_KIND, 
    name: 'helloworld'
};



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

   // Get Trace Plugin 
    const { data: plugin } = usePlugin(TRACE_QUERY_KEY, definition?.spec.plugin.kind);
    console.log("JZ traceImpl useTraceQueryImpl: plugin " , plugin)
    // const { data: datasourcePlugin } = usePlugin('Datasource', 'TempoDatasource');
    // console.log("JZ traceImpl useTraceQueryImpl: datasourcePlugin " , datasourcePlugin)

    // const context = ()=> {
    //     const tempoDatasourceStore = useDatasourceStore();
    //     console.log("JZ traceImpl datasourceStore ", tempoDatasourceStore)
    //     return tempoDatasourceStore
    // }

    // const client = await tempoDatasourceStore.getDatasourceClient(DEFAULT_TEMPO)
    // console.log("JZ traceImpl datasourceStore: client ", client)

    // console.log("JZ traceImpl: client.searchAll()", client.searchAll())


    // const options = {
    //     proxyUrl: 'http://localhost:3200',
    // }
    // const client = datasourcePlugin?.createClient(definition.spec.plugin.spec, options );
    // console.log("JZ traceImpl client: " , client)


    // Get datasource 
    const datasourceStore = useDatasourceStore();
    console.log('JZ traceImpl datasourceStore : ', datasourceStore)

    // Create a context for the query, this includes the datasource but 
    // also other variables, which at this time are removed for simplicity.
    const ctx = {
        datasourceStore
    }

    // queryKey is a required parameter for useQuery
    const queryKey = [definition, datasourceStore] as const; 

    // queryFn is a required parameter for useQuery 
    // const queryFn = ()=> {
    //     if (plugin === undefined) {
    //         throw new Error('Expected plugin to be loaded');
    //     }
    //     return plugin.getTraceData(definition.spec.plugin.spec, ctx)
    // }

    // Using the Tracing Plugin get a callback function to get the trace data
    const { getPlugin } = usePluginRegistry();
    // const queryFn2 = async ()=>{
    //         const plugin = await getPlugin(TRACE_QUERY_KEY, definition.spec.plugin.kind);
    //         const data = await plugin.getTraceData(definition.spec.plugin.spec, ctx);
    //         // console.log('JZ traceImpl queryFn > data' , data);
    //         return data;
    // }


    // useQuery() handles fetching and caching of data 
    return useQuery({
        queryKey: queryKey, 
        queryFn: async () => {
            const emptyTraceData:TraceData =  { traces: [] }
            const traceQueryKind = definition?.spec?.plugin?.kind; 
            console.log('JZ traceQueryKind : ', traceQueryKind);
            if (traceQueryKind === undefined){
                console.log('JZ traceQueryKind === undefined is true')
                return  emptyTraceData;
            }


            const plugin = await getPlugin(TRACE_QUERY_KEY, traceQueryKind);
            if (plugin === undefined) {
                throw new Error('Expected plugin to be loaded');
            }
            const data = await plugin.getTraceData(definition.spec.plugin.spec, ctx);
            return data;
        }
    }) 
}

    

