import { TempoDatasource } from "./tempo-datasource";
import { getTraceData } from "./get-trace-data";

// const getTraceData = () => {
//   const tempoStubClient = TempoDatasource.createClient(
//     {
//       direct_url: "http://localhost:3000/api/datasources/proxy/uid/tempo/",
//     },
//     {}
//   )
//   const response = (query:string = '{}') => {
//     (async () => {
//       await tempoStubClient.searchTraces(query).then((response) => 
//          {return response}
//       )
//     })();
//   };
//   return response
// }

/**
 * The core Tempo TraceQuery plugin for Perses.
 */
export const TempoTraceQuery = {
  getTraceData, 
  createInitialOptions: () => ({
    query: '{}',
    datasource: undefined,
  }),
};
