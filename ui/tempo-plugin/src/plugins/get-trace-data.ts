
import { TraceQueryPlugin } from "@perses-dev/plugin-system/dist/model/trace-queries"
import { TempoTraceQuerySpec } from "../model/trace-query-model"
import { TraceData } from "@perses-dev/plugin-system/dist/model/trace-queries";

export const getTraceData: TraceQueryPlugin<TempoTraceQuerySpec>['getTraceData'] = async (
    spec, 
    context, 
) => {
    const data = {
        traces: [
        {
            traceID: '123',
            rootServiceName: 'myRootService',
            rootTraceName: 'myRootTraceName',
            startTimeUnixNano: '4567',
            durationMs: 100, 
            spanSets: {
                matched: 0,
                spans: [] 
            }
        }
        ] 
    }
    return data;
}


export function TempoTraceQuery() {
    return 'hello world'
}