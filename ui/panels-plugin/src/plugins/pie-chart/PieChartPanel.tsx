import { useDataQueries, PanelProps } from '@perses-dev/plugin-system';
import { PieChartData, useChartsTheme } from '@perses-dev/components';
import { Box } from '@mui/material';
import { EChart } from '@perses-dev/components';
// eCharts
import { PieChart as EChartsPieChart } from 'echarts/charts';
import { GridComponent, DatasetComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { use, EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

import { BarChartOptions } from '../bar-chart';

// PieChart
import { PieChart } from '@perses-dev/components';

export type PiechartPanelProps = PanelProps<BarChartOptions>;

export function PieChartPanel(props: PiechartPanelProps) {
  const chartsTheme = useChartsTheme();
  const PADDING = chartsTheme.container.padding.default;

  
  const { queryResults, isLoading, isFetching } = useDataQueries('TimeSeriesQuery'); // gets data queries from a context provider, see DataQueriesProvider

  // TODO: Transform the queryResults into a PieChartData 
  const pieChartData: PieChartData[] = [
    {
      label: 'hello world',
      value: 1,
    },
    {
      label: 'hello world2',
      value: 2,
    },
  ];

  return (
    <Box sx={{ padding: `${PADDING}px` }}>
      <PieChart width={300} height={500} data={pieChartData} />
    </Box>
  );
}
