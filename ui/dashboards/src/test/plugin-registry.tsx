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

import { UnknownSpec } from '@perses-dev/core';
import { PanelPlugin, MockPlugin } from '@perses-dev/plugin-system';
import { ReactElement } from 'react';

const FakeTimeSeriesChartOptionEditor = (): ReactElement => {
  return <div>TimeSeriesChart options</div>;
};

const FakeTimeSeriesPlugin: PanelPlugin<UnknownSpec> = {
  PanelComponent: () => {
    return <div>TimeSeriesChart panel</div>;
  },
  panelOptionsEditorComponents: [
    {
      label: 'Settings',
      content: FakeTimeSeriesChartOptionEditor,
    },
  ],
  createInitialOptions: () => ({}),
  supportedQueryTypes: ['TimeSeriesQuery'],
};

const MOCK_TIME_SERIES_PANEL: MockPlugin = {
  kind: 'Panel',
  spec: { name: 'TimeSeriesChart' },
  plugin: FakeTimeSeriesPlugin,
};

// Array of default mock plugins added to the PluginRegistry during test renders
export const MOCK_PLUGINS: MockPlugin[] = [MOCK_TIME_SERIES_PANEL];
