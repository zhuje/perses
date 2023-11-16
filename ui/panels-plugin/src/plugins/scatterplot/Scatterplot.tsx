import React, { useMemo } from 'react';
import { EChart, useChartsTheme,  } from '@perses-dev/components';
import { use, EChartsCoreOption } from 'echarts/core';
import { ScatterChart as EChartsScatterChart, ScatterSeriesOption } from 'echarts/charts';
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts';


use([EChartsScatterChart, GridComponent, TitleComponent, TooltipComponent, CanvasRenderer]);

interface ScatterplotProps {
  width: number;
  height: number;
  data: ScatterSeriesOption[];
  xAxis?: EChartsCoreOption['xAxis'];
}

export function Scatterplot(props: ScatterplotProps) {
  const { width, height, data, xAxis } = props;
  const chartsTheme = useChartsTheme();

  const mockData =  [
    {
      data: [
        {
          "name": {
          "rootServiceName": "brie", 
          "rootTraceName": "cheese"
        }, 
          "value": [5,5], 
        },
        [1,2,5],
        [2,2,'two'],
        [3,3,'three'],
        [4,4,'four'],
        
      ], 
      type: 'scatter',
    }
  ]

  const option: EChartsCoreOption = useMemo(() => {
    if (!data) return chartsTheme.noDataOption;
    return {
      series: data, 
      grid: {
        bottom: 40,
        top: 50,
        left: 50, 
        right: 100,
      },
      xAxis: {
        type: 'time',
        name: 'UTC Time'
        // data: [1, 2, 3, 4]
        // TODO: customize axisLabel using https://echarts.apache.org/en/option.html#xAxis.axisLabel.formatter
      },
      yAxis: {
        scale: true,
        type: 'value', 
        name: 'Duration'
      },
      animation: false,
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function (param) {
          param = param[0];
          return [
            'startTimeUnixMs: ' + param.data[0] + '<br/>',
            'Duration (miliseconds): ' + param.data[1] + '<hr size=1 style="margin: 3px 0">',
            'spanCount: ' + param.data[2] + '<br/>',
            'errorCount: ' + param.data[3] + '<br/>',
            'name: ' + param.data[4] + '<br/>',
            'color: ' + param.data['color'] + '<br/>'
          ].join('');
        }
      },
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(120, 36, 50, 0.5)',
        shadowOffsetY: 5,
        color: 'red'
      },
      legend: {
        show: true,
        type: 'scroll',
        orient: 'horizontal',
        bottom: 0,
      },
    };
  }, [data, chartsTheme]);

  return (
    <EChart
      sx={{
        width: width,
        height: height,
      }}
      option={option}
      theme={chartsTheme.echartsTheme}
    />
  );
}
