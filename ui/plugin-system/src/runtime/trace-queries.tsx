import { QueryDefinition, UnknownSpec, DatasourceSelector } from "@perses-dev/core";
import { useDatasourceStore } from "./datasources";
import { useQueries } from "@tanstack/react-query";
import { usePluginRegistry } from "./plugin-registry";

export type TraceQueryDefinition<PluginSpec = UnknownSpec> = QueryDefinition<'TraceQuery', PluginSpec>;
export const TRACE_QUERY_KEY = 'TraceQuery';

/**
 * Run a trace query using a TraceQuery plugin and return the results 
 * @param definition: dashboard defintion for a trace query, written in Trace Query Language (TraceQL)
 * Documentation for TraceQL: https://grafana.com/docs/tempo/latest/traceql/
 */
export function useTraceQueries (
    definitions: TraceQueryDefinition[],
) {
    const { getPlugin } = usePluginRegistry();

    const datasourceStore = useDatasourceStore();
    const ctx = {
        datasourceStore
    }

    return useQueries({
        queries: definitions.map((definition) => {
            const queryKey = [definition, datasourceStore] as const; 
            const traceQueryKind = definition?.spec?.plugin?.kind; 
            return {
                queryKey: queryKey,
                queryFn: async () => {
                    const plugin = await getPlugin(TRACE_QUERY_KEY, traceQueryKind);
                    const data = await plugin.getTraceData(definition.spec.plugin.spec, ctx);
                    return data;
                },
            }
        })
    })
}

    

