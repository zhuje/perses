import { useTimeSeriesQuery, PanelProps } from '@perses-dev/plugin-system';
import { Box, Skeleton } from '@mui/material';
import { ScatterSeriesOption } from 'echarts/charts';
import { useMemo } from 'react';
import { ScatterChartOptions } from './scatter-chart-model';
import { Scatterplot } from './Scatterplot';
import { useSuggestedStepMs } from './utils';
import { TimeSeriesQueryDefinition } from '@perses-dev/core';
import { useDataQueries } from '@perses-dev/plugin-system';
import { EChartsOption } from 'echarts';
import { SeriesOption } from 'echarts';

export type ScatterChartPanelProps = PanelProps<ScatterChartOptions>;

export function ScatterChartPanel(props: ScatterChartPanelProps) {
  const {
    contentDimensions,
  } = props;

  const { queryResults: traceResults, isLoading: traceIsLoading } = useDataQueries('TraceQuery');
  const { queryResults: timeSeriesResults, isLoading: timeSeriesIsLoading } = useDataQueries('TimeSeriesQuery');

  const isLoading = traceIsLoading || timeSeriesIsLoading;


  console.log('/apple traceResult: ', traceResults)
  console.log('/apple traceIsLoading >: ', traceIsLoading)

  console.log('/apple timeSeriesResults: ', timeSeriesResults)
  console.log('/apple timeSeriesIsLoading >: ', timeSeriesIsLoading)

  // TODO: is there a better way to determine the queryType?


  // TODO: Handle the case were traces are empty --- the query is valid but no traces are returned 
  




  // Tempo API data transformation and chart formatting to fit requirements for eCharts:
  // https://echarts.apache.org/handbook/en/concepts/dataset
  const dataset = useMemo(() => {
    const traceData = traceResults[0]?.data
    if (traceData === undefined) {
      return [];
    }
    // Transform data from api to fit format of apache eCharts 
    const source = traceData.traces.map((trace) => {
      return {
        ...trace,
        startTimeUnixMs: new Date(trace.startTimeUnixMs) // convert unix epoch time
      }
    })
    const dataset = {
      source: source,
    }
    return dataset 
  }, [traceIsLoading, traceResults]);

  const seriesFormatting:SeriesOption = 
     {
        type: 'scatter',
        encode: {
          // Map to x-axis.
          x: 'startTimeUnixMs',
          // Map to y-axis.
          y: 'durationMs',
        },
        symbolSize: function(data:any){
          // Changes datapoint to correspond to number of spans in a trace
          const scaleSymbolSize = 10;
          return data.spanCount * scaleSymbolSize;
        },
        itemStyle: {
          color: function(params:any){
            // If the trace contains an error, color the datapoint in red  
            if (params.data.errorCount !== undefined && params.data.errorCount > 0) {
              return 'red'
            }
            // Else return default color
            const defaultColor = "#56B4E9"
            return defaultColor
          }
        }
      }

  const options: EChartsOption = {
    dataset: dataset, 
    series: seriesFormatting, 
  }

  if (contentDimensions === undefined) return null;

  if (isLoading === true) {
    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        width={contentDimensions.width}
        height={contentDimensions.height}
      >
        <Skeleton variant="text" width={contentDimensions.width - 20} height={contentDimensions.height / 2} />
      </Box>
    );
  }
  return (
    <Scatterplot width={contentDimensions.width} height={contentDimensions.height} options={options}/>
  );
}
