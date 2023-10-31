import { TraceQueryPlugin } from "@perses-dev/plugin-system"
import { TempoTraceQuerySpec } from "../model/trace-query-model"
import { TEMPO_DATASOURCE_KIND } from "../model/tempo-selectors";
import { TempoDatasourceSelector } from "../model/tempo-selectors";
import { TempoClient } from "../model/tempo-client";
import { TraceData } from "@perses-dev/core";

export const getTraceData: TraceQueryPlugin<TempoTraceQuerySpec>['getTraceData'] = async (
    spec, 
    context 
) => {   
    if (spec.query === undefined || spec.query === null || spec.query === '') {
        // Do not make a request to the backend, instead return an empty TraceData
        console.error('TempoTraceQuery is undefined, null, or an empty string.')
        return { traces: [] };
    }

    const defaultTempoDatasource: TempoDatasourceSelector = { 
        kind: TEMPO_DATASOURCE_KIND, 
    };

    const client: TempoClient = await context.datasourceStore.getDatasourceClient(spec.datasource ?? defaultTempoDatasource);
    
    const datasourceUrl = client?.options?.datasourceUrl
    if (datasourceUrl === undefined || datasourceUrl === null || datasourceUrl === '') {
        console.error('TempoDatasource is undefined, null, or an empty string.')
        return { traces: [] };
    }

    const response = await client.searchTraces(spec.query, datasourceUrl)

    const traceData: TraceData = {
        traces: response.traces
    }

    return traceData
}

