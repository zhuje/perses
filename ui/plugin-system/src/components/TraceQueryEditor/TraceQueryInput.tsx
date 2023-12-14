import { TraceQueryDefinition } from "../../runtime";
import { Stack, IconButton, Typography, BoxProps, Box } from '@mui/material';
import ChevronDown from 'mdi-material-ui/ChevronDown';
import ChevronRight from 'mdi-material-ui/ChevronRight';
import DeleteIcon from 'mdi-material-ui/DeleteOutline';
import { PluginEditor, PluginEditorProps } from "../PluginEditor";
import produce from 'immer';

interface TraceQueryInputProps {
    query: TraceQueryDefinition;
    index: number;
    onChange: (index: number, query: TraceQueryDefinition) => void;
    onCollapseExpand: (index: number) => void;
    isCollapsed?: boolean;
    onDelete?: (index: number) => void;
}

// Props on MUI Box that we don't want people to pass because we're either redefining them or providing them in
// this component
type OmittedMuiProps = 'children' | 'value' | 'onChange';

interface QueryEditorProps extends Omit<BoxProps, OmittedMuiProps> {
  value: TraceQueryDefinition;
  onChange: (next: TraceQueryDefinition) => void;
}

export const TraceQueryInput =({
    index,
    query,
    isCollapsed,
    onDelete,
    onChange,
    onCollapseExpand,
}: TraceQueryInputProps) => {
    return(
        <Stack key={index} spacing={1}>
        <h1> TraceQueryInput Component</h1>
        <Stack direction="row" alignItems="center" borderBottom={1} borderColor={(theme) => theme.palette.divider}>
          <IconButton size="small" onClick={() => onCollapseExpand(index)}>
            {isCollapsed ? <ChevronRight /> : <ChevronDown />}
          </IconButton>
          <Typography variant="overline" component="h4">
            Query {index + 1}
          </Typography>
          <IconButton
            size="small"
            // Use `visibility` to ensure that the row has the same height when delete button is visible or not visible
            sx={{ marginLeft: 'auto', visibility: `${onDelete ? 'visible' : 'hidden'}` }}
            onClick={() => onDelete && onDelete(index)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
        {!isCollapsed && <QueryEditor value={query} onChange={(next) => onChange(index, next)} />}
      </Stack>
    );   
}

/**
 * Displays an editor for TraceQueryDefinition objects.
 */
function QueryEditor(props: QueryEditorProps) {
  const { value, onChange, ...others } = props;
  const {
    spec: { plugin },
  } = value;

  const handlePluginChange: PluginEditorProps['onChange'] = (next) => {
    onChange(
      produce(value, (draft) => {
        draft.spec.plugin = next;
      })
    );
  };

  return (
    <Box {...others}>
            <h1> QueryEditor Component</h1>
      <PluginEditor
        pluginType="TraceQuery"
        pluginKindLabel="Query Type"
        value={plugin}
        onChange={handlePluginChange}
      />
    </Box>
  );
}


