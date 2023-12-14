import { useTheme } from '@mui/material';
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';

export function TraceQLEditor({...rest}){
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
  
    return (
    <CodeMirror
        {...rest}
        style={{ border: `1px solid ${theme.palette.divider}` }}
        theme={isDarkMode ? 'dark' : 'light'}
        basicSetup={{
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          foldGutter: false,
        }}
      />

    )
}