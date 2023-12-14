// @ts-ignore
// TODO: remove this laster

import { EChart, useChartsTheme,  } from '@perses-dev/components';
import { use, EChartsCoreOption } from 'echarts/core';
import { ScatterChart as EChartsScatterChart, ScatterSeriesOption } from 'echarts/charts';
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts';


use([EChartsScatterChart, GridComponent, TitleComponent, TooltipComponent, CanvasRenderer]);

interface ScatterplotProps {
  width: number;
  height: number;
  xAxis?: EChartsCoreOption['xAxis'];
  options: EChartsOption;
}

export function Scatterplot(props: ScatterplotProps) {
  const { width, height, xAxis, options } = props;
  const chartsTheme = useChartsTheme();

  console.log('JZ Scatterplot > Options, ', options)

  var eChartOptions:EChartsCoreOption = {
    dataset: options.dataset,
    series: options.series,
    grid: {
      bottom: 40,
      top: 50,
      left: 50, 
      right: 100,
    },
    xAxis: {
      type: 'time',
      name: 'Local Time'
    },
    yAxis: {
      scale: true,
      type: 'value', 
      name: 'Duration',
      axisLabel: {
        formatter: '{value} ms'
      }
    },
    animation: false,
    tooltip: {
      padding: 5,
      borderWidth: 1,
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      formatter: function(param:any) {
        console.log('JZ /bread : ', param)
        param = param[0];
        return [
          '<b>time</b>: ' + param.data.startTimeUnixMs + '<br/>',
          '<b>duration (miliseconds)</b>: ' + param.data.durationMs + '<br/>',
          '<b>spanCount</b>: ' + param.data.spanCount + '<br/>',
          '<b>errorCount</b>: ' + param.data.errorCount + '<br/>',
          '<b>name</b>: ' + param.data.name + '<br/>',
        ].join('');
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 20
      },
      {
        start: 0,
        end: 20
      }
    ],
    legend: {
      show: true,
      type: 'scroll',
      orient: 'horizontal',
      bottom: 0,
    },


  };

  return (
    <EChart
      sx={{
        width: width,
        height: height,
      }}
      option={eChartOptions}
      theme={chartsTheme.echartsTheme}
    />
  );
}
