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

import { ErrorAlert, JSONEditor } from '@perses-dev/components';
import { PanelDefinition, QueryDefinition, UnknownSpec } from '@perses-dev/core';
import { usePlugin } from '../../runtime';
import { PanelPlugin } from '../../model';
import { OptionsEditorTabsProps, OptionsEditorTabs } from '../OptionsEditorTabs';
import { TimeSeriesQueryEditor } from '../TimeSeriesQueryEditor';
import { useState, FC, ReactNode, useMemo } from 'react';
import { TraceQueryEditor } from '../TraceQueryEditor';

export interface PanelSpecEditorProps {
  panelDefinition: PanelDefinition;
  onQueriesChange: (queries: QueryDefinition[]) => void;
  onPluginSpecChange: (spec: UnknownSpec) => void;
  onJSONChange: (panelDefinitionStr: string) => void;
}

export function PanelSpecEditor(props: PanelSpecEditorProps) {
  const { panelDefinition, onJSONChange, onQueriesChange, onPluginSpecChange } = props;
  const { kind } = panelDefinition.spec.plugin;
  const { data: plugin, isLoading, error } = usePlugin('Panel', kind);

  console.log('/editor PanelSpecEditor prop: ', props)
  
  let errorAlert = ((description: string) => {
    return {
      name: description, 
      message: description
    }
  }) 

  if (error) {
    return <ErrorAlert error={error} />;
  }

  // TODO: Proper loading indicator
  if (isLoading) {
    return null;
  }

  if (plugin === undefined) {
    throw new Error(`Missing implementation for panel plugin with kind '${kind}'`);
  }

  const getQueryType = (()=> {
    // Check that queries are not undefined
    const queriesList = panelDefinition?.spec?.queries
    if (queriesList === undefined){
      const description = 'Query specification is undefined.'
      return <ErrorAlert error={errorAlert(description)}/>
    }
    // Check that all the queries the panel are the same query type. 
    const areAllQueryTypesSame = (()=> {
      return queriesList?.every((query, i, queriesList) => query.kind === queriesList[0]?.kind)
    })
    if (!areAllQueryTypesSame){
      const description = 'Your panel is trying to use multiple query kinds. All queries types in this panel must be the same.'
      return <ErrorAlert error={errorAlert(description)}/>
    }

    const queryType:string = queriesList[0]?.kind
    return queryType;
  })


  // Get the corresponding queryEditor depending on the queryType. 
  const getQueryEditorComponent = (() => {
    const queryType = getQueryType();
    switch (queryType){
    case 'TimeSeriesQuery':
      return <TimeSeriesQueryEditor queries={panelDefinition.spec.queries ?? []} onChange={onQueriesChange} />
    case 'TraceQuery':
      return <TraceQueryEditor queries={panelDefinition.spec.queries ?? []} onChange={onQueriesChange} />
    default: 
        // const message = "This query kind, `" + queryType + "` , is not recognized." 
        // const error = {
        //   name: message,
        //   message: message
        // }
        // return(
        //   <ErrorAlert error={error}/>
        // )
      return <TimeSeriesQueryEditor queries={panelDefinition.spec.queries ?? []} onChange={onQueriesChange} />
    }
  })

  const { panelOptionsEditorComponents, hideQueryEditor } = plugin as PanelPlugin;
  let tabs: OptionsEditorTabsProps['tabs'] = [];

  if (!hideQueryEditor) {
    tabs.push({
      label: 'Query',
      content: getQueryEditorComponent()      
    });
  }

  if (panelOptionsEditorComponents !== undefined) {
    tabs = tabs.concat(
      panelOptionsEditorComponents.map(({ label, content: OptionsEditorComponent }) => ({
        label,
        content: <OptionsEditorComponent value={panelDefinition.spec.plugin.spec} onChange={onPluginSpecChange} />,
      }))
    );
  }

  // always show json editor by default
  tabs.push({
    label: 'JSON',
    content: <JSONEditor maxHeight="80vh" value={panelDefinition} onChange={onJSONChange} />,
  });

  return <OptionsEditorTabs key={tabs.length} tabs={tabs} />;
}
