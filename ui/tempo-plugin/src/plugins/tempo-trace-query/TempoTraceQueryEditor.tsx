import { DEFAULT_TEMPO, isDefaultTempoSelector, isTempoDatasourceSelector } from "../../model/tempo-selectors";
import { TraceQueryEditorProps } from "./query-editor-model"
import { DatasourceSelectProps, useDatasource, useDatasourceClient } from '@perses-dev/plugin-system';
import { TempoClient } from "../../model/tempo-client";
import { useQueryState } from "./query-editor-model";
import { produce } from 'immer';
import { DashboardTempoTraceQueryEditor } from "./DashboardTempoTraceQueryEditor";

export function TempoTraceQueryEditor(props: TraceQueryEditorProps){
  const { onChange, value, isExplore } = props;
  const { datasource } = value;
  const selectedDatasource = datasource ?? DEFAULT_TEMPO


  const { data: client } = useDatasourceClient<TempoClient>(selectedDatasource);
  const datasourceURL = client?.options.datasourceUrl;
  const { data: datasourceResource } = useDatasource(selectedDatasource);

  const { query, handleQueryChange, handleQueryBlur } = useQueryState(props);


  const handleDatasourceChange: DatasourceSelectProps['onChange'] = (next) => {
    if (isTempoDatasourceSelector(next)) {
      onChange(
        produce(value, (draft) => {
          // If they're using the default, just omit the datasource prop (i.e. set to undefined)
          const nextDatasource = isDefaultTempoSelector(next) ? undefined : next;
          draft.datasource = nextDatasource;
        })
      );
      return;
    }

    throw new Error('Got unexpected non-Tempo datasource selector');
  };

    return (
      <DashboardTempoTraceQueryEditor
      selectedDatasource={selectedDatasource}
      handleDatasourceChange={handleDatasourceChange}
      datasourceURL={datasourceURL}
      query={query}
      handleQueryChange={handleQueryChange}
      handleQueryBlur={handleQueryBlur}
      
      />
    
      )
  }