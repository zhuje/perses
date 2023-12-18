// Copyright 2023 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { QueryDefinition } from '@perses-dev/core';
import { Button, Stack } from '@mui/material';
import AddIcon from 'mdi-material-ui/Plus';
import { useState } from 'react';
import { produce } from 'immer';
import { usePlugin, usePluginRegistry, TraceQueryDefinition } from '../../runtime';
import { TraceQueryInput } from './TraceQueryInput';

const DEFAULT_QUERY_PLUGIN_TYPE = 'TraceQuery';

export interface TraceQueryEditorProps {
  queries?: TraceQueryDefinition[];
  onChange: (queries: QueryDefinition[]) => void;
}

export function TraceQueryEditor({ queries = [], onChange }: TraceQueryEditorProps) {
  const hasMoreThanOneQuery = queries.length > 1;
  const { defaultPluginKinds } = usePluginRegistry();
  const defaultTraceQueryKind = defaultPluginKinds?.[DEFAULT_QUERY_PLUGIN_TYPE] ?? '';

  // State for which queries are collapsed
  // TODO: Would be easier if we had IDs for queries.
  const [queriesCollapsed, setQueriesCollapsed] = useState(queries.map(() => false));

  const { data: defaultQueryPlugin } = usePlugin(DEFAULT_QUERY_PLUGIN_TYPE, defaultTraceQueryKind, {
    useErrorBoundary: true,
    enabled: true,
  });

  // Query handlers
  const handleQueryChange = (index: number, queryDef: TraceQueryDefinition) => {
    onChange(
      produce(queries, (draft) => {
        if (draft) {
          draft[index] = queryDef;
        } else {
          draft = [queryDef];
        }
      })
    );
  };

  const handleQueryAdd = () => {
    if (!defaultQueryPlugin) return;
    onChange(
      produce(queries, (draft) => {
        const queryDef: TraceQueryDefinition = {
          kind: DEFAULT_QUERY_PLUGIN_TYPE,
          spec: {
            plugin: { kind: defaultTraceQueryKind, spec: defaultQueryPlugin.createInitialOptions() },
          },
        };
        if (draft) {
          draft.push(queryDef);
        } else {
          draft = [...queries, queryDef];
        }
      })
    );
    setQueriesCollapsed((queriesCollapsed) => {
      queriesCollapsed.push(false);
      return [...queriesCollapsed];
    });
  };

  const handleQueryDelete = (index: number) => {
    onChange(
      produce(queries, (draft) => {
        draft.splice(index, 1);
      })
    );
    setQueriesCollapsed((queriesCollapsed) => {
      queriesCollapsed.splice(index, 1);
      return [...queriesCollapsed];
    });
  };

  const handleQueryCollapseExpand = (index: number) => {
    setQueriesCollapsed((queriesCollapsed) => {
      queriesCollapsed[index] = !queriesCollapsed[index];
      return [...queriesCollapsed];
    });
  };

  // show one query input if queries is empty
  const queryDefinitions: TraceQueryDefinition[] = queries.length
    ? queries
    : [
        {
          kind: 'TraceQuery',
          spec: {
            plugin: {
              kind: 'TempoTraceQuery',
              spec: {
                query: '',
              },
            },
          },
        },
      ];

  return (
    <>
      <Stack spacing={1}>
        {queryDefinitions.map((query: TraceQueryDefinition, i: number) => (
          <TraceQueryInput
            key={i}
            index={i}
            query={query}
            isCollapsed={!!queriesCollapsed[i]}
            onChange={handleQueryChange}
            onDelete={hasMoreThanOneQuery ? handleQueryDelete : undefined}
            onCollapseExpand={handleQueryCollapseExpand}
          />
        ))}
      </Stack>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ marginTop: 1 }} onClick={handleQueryAdd}>
        Add Query
      </Button>
    </>
  );
}
