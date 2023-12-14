import { Stack, FormControl, InputLabel } from '@mui/material';
import { DatasourceSelect } from '@perses-dev/plugin-system';
import { DatasourceSelector } from '@perses-dev/core/dist/model';
import { TempoDatasourceSelector } from '../../model/tempo-selectors';
import { TEMPO_DATASOURCE_KIND } from '../../model/tempo-selectors';
import { TraceQLEditor } from './TraceQLEditor';

interface DashboardTempoTraceQueryEditorProps {
    selectedDatasource: TempoDatasourceSelector;
    handleDatasourceChange: (next: DatasourceSelector) => void;
    datasourceURL: string | undefined;
    query: string;
    handleQueryChange: (e: string) => void;
    handleQueryBlur: () => void;
  }

export function DashboardTempoTraceQueryEditor(props: DashboardTempoTraceQueryEditorProps) {
    const {
      selectedDatasource,
      handleDatasourceChange,
      datasourceURL,
      query,
      handleQueryChange,
      handleQueryBlur,
    } = props;

  return (
    <Stack spacing={2}>
      <FormControl margin="dense" fullWidth={false}>
        {/* TODO: How do we ensure unique ID values if there are multiple of these? Can we use React 18 useId and
                maintain 17 compatibility somehow with a polyfill/shim? */}
        <InputLabel id="tempo-datasource-label">Tempo Datasource</InputLabel>
        <DatasourceSelect
          datasourcePluginKind={TEMPO_DATASOURCE_KIND}
          value={selectedDatasource}
          onChange={handleDatasourceChange}
          labelId="tempo-datasource-label"
          label="Tempo Datasource"
        />
      </FormControl>
      <TraceQLEditor
        completeConfig={{ remote: { url: datasourceURL } }}
        value={query}
        onChange={handleQueryChange}
        onBlur={handleQueryBlur}
      />
    </Stack>
  );
}