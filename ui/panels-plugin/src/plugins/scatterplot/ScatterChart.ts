import { PanelPlugin } from '@perses-dev/plugin-system';
import { createInitialScatterChartOptions, ScatterChartOptions } from './scatter-chart-model';
// import { ScatterChartOptionsEditor } from './ScatterChartOptionsEditor';
import { ScatterChartPanel } from './ScatterChartPanel';
// import { ScatterChartOptionsEditorSettings } from './ScatterChartOptionsEditorSettings';

/**
 * The core ScatterChart panel plugin for Perses.
 */
export const ScatterChart: PanelPlugin<ScatterChartOptions> = {
  PanelComponent: ScatterChartPanel,
  // TODO: add a chart options editor plugin
  // panelOptionsEditorComponents: [{ label: 'Settings', content: ScatterChartOptionsEditorSettings }],
  createInitialOptions: createInitialScatterChartOptions,
};
