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
import { ErrorAlert } from '@perses-dev/components';
import { convertThresholds } from '../../model/thresholds';

const generateErrorAlert = ((message:string)=>{
  const alertMessage = {
    name: message, 
    message: message, 
  }
  return <ErrorAlert error={alertMessage}/>
})

export type ScatterChartPanelProps = PanelProps<ScatterChartOptions>;

export function ScatterChartPanel(props: ScatterChartPanelProps) {
  const {
    contentDimensions,
  } = props;

  // TODO: handle both TraceQuery and TimeSeriesQuery -- how to handle switching between query types?
  // TODO: is there a better way to determine the queryType?

  const { queryResults: traceResults, isLoading: traceIsLoading } = useDataQueries('TraceQuery');
  const { queryResults: timeSeriesResults, isLoading: timeSeriesIsLoading } = useDataQueries('TimeSeriesQuery');

  const isLoading = traceIsLoading || timeSeriesIsLoading;

  const traceData = traceResults[0]?.data

  if (!isLoading && traceData?.traces.length === 0 ){
    const query = traceData?.metadata?.executedQueryString
    const message = `No traces found for the query : " ${query} " .`;
    const alertMessage = {
      name: message, 
      message: message, 
    }
    return <ErrorAlert error={alertMessage}/>
}

  // Tempo API data transformation to fit requirements for eCharts:
  // https://echarts.apache.org/handbook/en/concepts/dataset
  const dataset = useMemo(() => {
    if (traceData === undefined) {
      return [];
    }
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
