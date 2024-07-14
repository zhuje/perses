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

import { useMemo } from 'react';
import { FormatOptions, formatValue } from '@perses-dev/core';
import { use, EChartsCoreOption } from 'echarts/core';
import { PieChart as EChartsPieChart } from 'echarts/charts';
import { GridComponent, DatasetComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { Box } from '@mui/material';
import { useChartsTheme } from '../context/ChartsProvider';
import { EChart } from '../EChart';
import { ModeOption } from '../ModeSelector';
import { getFormattedAxis } from '../utils';

use([EChartsPieChart, GridComponent, DatasetComponent, TitleComponent, TooltipComponent, CanvasRenderer]);

const BAR_WIN_WIDTH = 14;
const BAR_GAP = 6;

export interface PieChartData {
  label: string;
  value: number | null;
}

export interface PieChartProps {
  width: number;
  height: number;
  data: PieChartData[] | null;
  format?: FormatOptions;
  mode?: ModeOption;
}

export function PieChart(props: PieChartProps) {
  const { width, height, data, format = { unit: 'decimal' }, mode = 'value' } = props;
  const chartsTheme = useChartsTheme();

  const option = {
    title: {
      text: 'Referer of a Website',
      subtext: 'Fake Data',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  
  return (
    <Box sx={{ width: width, height: height, overflow: 'auto' }}>
      <EChart
        sx={{
          minHeight: height,
          height: data ? data.length * (BAR_WIN_WIDTH + BAR_GAP) : '100%',
        }}
        option={option}
        theme={chartsTheme.echartsTheme}
      />
    </Box>
  );
}
