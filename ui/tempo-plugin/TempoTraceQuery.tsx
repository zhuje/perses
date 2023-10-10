import { TempoDatasource } from "./TempoDataSource";

const getData = () => {
  const tempoStubClient = TempoDatasource.createClient(
    {
      direct_url: "http://localhost:3000/api/datasources/proxy/uid/tempo/",
    },
    {}
  )
  const response = (query:string = '{}') => {
    (async () => {
      await tempoStubClient.searchTraces(query).then((response) => 
         {return response}
      )
    })();
  };
  return response
}

/**
 * The core Tempo TraceQuery plugin for Perses.
 */
export const TempoTraceQuery = {
  getData, 
  createInitialOptions: () => ({
    query: '{}',
    datasource: undefined,
  }),
};
