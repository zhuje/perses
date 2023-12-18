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

import { PanelPlugin } from '@perses-dev/plugin-system';
import { createInitialScatterChartOptions, ScatterChartOptions } from './scatter-chart-model';
import { ScatterChartPanel } from './ScatterChartPanel';

/**
 * The core ScatterChart panel plugin for Perses.
 */
export const ScatterChart: PanelPlugin<ScatterChartOptions> = {
  PanelComponent: ScatterChartPanel,
  // TODO: add a chart options editor plugin
  // panelOptionsEditorComponents: [{ label: 'Settings', content: ScatterChartOptionsEditorSettings }],
  createInitialOptions: createInitialScatterChartOptions,
};
