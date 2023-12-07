// @ts-ignore
// TODO: remove this laster

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
  dataset?: ScatterSeriesOption[]; 
}

export function Scatterplot(props: ScatterplotProps) {
  const { width, height, data, xAxis, dataset } = props;
  const chartsTheme = useChartsTheme();

  console.log('JZ Scatterplot Data , ', data)

  console.log('/scatterTraceData2 : ', dataset)

  // const mockData =  [
  //   {
  //     data: [
  //       {
  //         "name": {
  //           "rootServiceName": "brie", 
  //           "rootTraceName": "cheese"
  //         }, 
  //         "value": ["05:00:00",5], 
  //       },
  //       ["01:00:00",1,5],
  //       ["02:00:00",2,'two'],
  //       ["03:00:00",3,'three'],
  //       ["04:00:00",4,'four'],
        
  //     ], 
  //     type: 'scatter',
  //   }
  // ]

  // const dataset = {
  //   source: [
  //     ["startTimeUnixMs", "duration", "spanCount", "errorCount", "name"],
  //     [new Date('December 17, 1995 03:24:00'), 1, 85.8, 93.7],
  //     [new Date('December 18, 1995 03:24:00'), 2, 73.4, 55.1],
  //     [new Date('December 19, 1995 03:24:00'), 3, 65.2, 82.5],
  //     [new Date('December 20, 1995 03:24:00'), 4, 53.9, 39.1]
  //   ]
  // }
  // const series =
  //   [{
  //     type: 'scatter'
  //   }]

  
  //   const testObjectBasedDataSet = {
  //     type: 'scatter',
  //     dimensions: ['startTimeUnixMs', 'duration', 'spanCount', 'errorCount', 'name'],
  //     encode: {
  //       x: 'startTimeUnixMs',
  //       y: 'duration',
  //       tooltip: ['startTimeUnixMs', 'durationMs', 'spanCount', 'errorCount', 'name']
  //     },
  //     source: [
  //       { startTimeUnixMs: new Date(1701898122), duration: 1, spanCount: 5, errorCount: 1, name: 'datapoint_1' },
  //       { startTimeUnixMs: new Date(1701898122 - 3600), duration: 2, spanCount: 6, errorCount: 2, name: 'datapoint_2' },
  //       { startTimeUnixMs: new Date(1701898122 - (3600*2)), duration: 3, spanCount: 7, errorCount: 3, name: 'datapoint_3' },
  //       { startTimeUnixMs: new Date(1701898122 - (3600*3)), duration: 4, spanCount: 8, errorCount: 0, name: 'datapoint_4' },
  //     ]
  //   }
  

  // const option: EChartsCoreOption = useMemo(() => {
  //   if (!data) return chartsTheme.noDataOption;
  //   return {
  //     // series: data, 
  //     dataset: data,
  //     // series: series,
  //     grid: {
  //       bottom: 40,
  //       top: 50,
  //       left: 50, 
  //       right: 100,
  //     },
  //     xAxis: {
  //       type: 'time',
  //       name: 'Local Time',
  //       // data: [1, 2, 3, 4]
  //       // TODO: customize axisLabel using https://echarts.apache.org/en/option.html#xAxis.axisLabel.formatter
  //     },
  //     yAxis: {
  //       scale: true,
  //       type: 'value', 
  //       name: 'Duration'
  //     },
  //     animation: false,
  //     tooltip: {
  //       // show: true,
  //       trigger: 'axis',
  //       axisPointer: {
  //         type: 'cross'
  //       },
  //       // formatter: function(param:any) {
  //       //   console.log('JZ /bread : ', param)
  //       //   param = param[0];
  //       //   return [
  //       //     'startTimeUnixMs: ' + param.data[0] + '<br/>',
  //       //     'Duration (miliseconds): ' + param.data[1] + '<hr size=1 style="margin: 3px 0">',
  //       //     'spanCount: ' + param.data[2] + '<br/>',
  //       //     'errorCount: ' + param.data[3] + '<br/>',
  //       //     'name: ' + param.data[4] + '<br/>',
  //       //     'color: ' + param.data[5] + '<br/>'
  //       //   ].join('');
  //       // }
  //     },
  //     dataZoom: [
  //       {
  //         type: 'inside',
  //         start: 0,
  //         end: 20
  //       },
  //       {
  //         start: 0,
  //         end: 20
  //       }
  //     ],
  //     legend: {
  //       show: true,
  //       type: 'scroll',
  //       orient: 'horizontal',
  //       bottom: 0,
  //     },
  //   };
  // }, [data, chartsTheme]);


  var options2:EChartsCoreOption = {
    dataset: 
      dataset,
    series: [
      {
        type: 'scatter',
        encode: {
          // Map "amount" column to x-axis.
          x: 'startTimeUnixMs',
          // Map "product" row to y-axis.
          y: 'durationMs',
          tooltip: ['startTimeUnixMs','durationMs', 'spanCount', 'errorCount', 'name', 'traceId']
        },
        symbolSize: function(data:any){
          const scaleSymbolSize = 10;
          return data.spanCount * scaleSymbolSize;
        },
        itemStyle: {
          color: function(params:any){
            console.log('/cabbage  itemStyle > Color > params: ', params)
            if (params.data.errorCount !== undefined && params.data.errorCount > 0) {
              return 'red'
            }
            // Else return default color
            const defaultColor = "#56B4E9"
            return defaultColor
          }
        }
      }, 
    ],
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
      name: 'Duration'
    },
    animation: false,
    tooltip: {
      // show: true,
      padding: 5,
      borderWidth: 1,
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
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
    axisPointer: {
      link: { xAxisIndex: 'all' },
      label: {
        backgroundColor: '#777'
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

  function beautifyJSON(){
    
  }

  return (
    <EChart
      sx={{
        width: width,
        height: height,
      }}
      option={options2}
      theme={chartsTheme.echartsTheme}
    />
  );
}
