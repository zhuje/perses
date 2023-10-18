
import { TraceQueryPlugin } from "@perses-dev/plugin-system"
import { TempoTraceQuerySpec } from "../model/trace-query-model"
import { TraceData } from "@perses-dev/plugin-system";
import { DEFAULT_TEMPO } from "../model/tempo-selectors";
import { TEMPO_DATASOURCE_KIND } from "../model/tempo-selectors";
import { TempoDatasourceSelector } from "../model/tempo-selectors";
import { TempoClient } from "../model/tempo-client";

export const getTraceData: TraceQueryPlugin<TempoTraceQuerySpec>['getTraceData'] = async (
    spec, 
    context 
) => {
    // const data = {
    //     traces: [
    //     {
    //         traceID: '123',
    //         rootServiceName: 'myRootService',
    //         rootTraceName: 'myRootTraceName',
    //         startTimeUnixNano: '4567',
    //         durationMs: 100, 
    //         spanSets: {
    //             matched: 0,
    //             spans: [] 
    //         }
    //     }
    //     ] 
    // }
    // return data;

   
    if (spec.query === undefined || spec.query === null || spec.query === '') {
        // Do not make a request to the backend, instead return an empty TimeSeriesData
        return { series: [] };
    }

    const defaultTempoDatasource: TempoDatasourceSelector = { 
        kind: TEMPO_DATASOURCE_KIND, 
        // // NOTE: A TempoDatasource must be declared as the 'default: true' in the GlobalDatasoure spec 
        // // otherwise you will have to define the name of the tempo datasource
        // name: 'helloworld' 
    };

    const client: TempoClient = await context.datasourceStore.getDatasourceClient(spec.datasource ?? defaultTempoDatasource);
    console.log('JZ /proxy traceImpl > tempo-plugin > getTraceData > client : ', client)

    const datasourceUrl = client?.options?.datasourceUrl
    if (!datasourceUrl){
        console.error('Trace Query is missing a datasource')
    }
    
    const response = await client.searchTraces('{}', client.options.datasourceUrl)
    console.log("JZ traceImpl > tempo-plugin > getTraceData > response : ", JSON.stringify(response, null, 3))

    const traceData: TraceData = {
        
    }

    // NEEds to return as TRACE data not Search Response 
    return response


}


// export function getTraceData(){
//     return 'helloworld'
// }




export function TempoTraceQuery() {
    return 'hello world'
}