import { useTimeSeriesQuery, PanelProps } from '@perses-dev/plugin-system';
import { Box, Skeleton } from '@mui/material';
import { ScatterSeriesOption } from 'echarts/charts';
import { useMemo } from 'react';
import { ScatterChartOptions } from './scatter-chart-model';
import { Scatterplot } from './Scatterplot';
import { useSuggestedStepMs } from './utils';
import { useDataQueries } from '@perses-dev/plugin-system';
import { TimeSeriesQueryDefinition } from '@perses-dev/core';

export type ScatterChartPanelProps = PanelProps<ScatterChartOptions>;

export function ScatterChartPanel(props: ScatterChartPanelProps) {
  const {
    // spec: { query },
    contentDimensions,
  } = props;
  const suggestedStepMs = useSuggestedStepMs(contentDimensions?.width) * 10; // temp calc for demo


  


  const query =  {
    kind: 'TimeSeriesQuery',
    spec: {
      plugin: {
        kind: 'PrometheusTimeSeriesQuery',
        spec: {
          query:
            'avg without (cpu)(rate(node_cpu_seconds_total{job=~"node|alertmanager",instance="demo.do.prometheus.io:9100",mode=~"user|idle"}[30m]))',
        },
      },
    },
  } as TimeSeriesQueryDefinition

 // const { data, isLoading, error } = useTimeSeriesQuery(query, { suggestedStepMs });
  // console.log('JZ query data: ', data)

  


  


  // ScatterPlot Todos 
  // 1. visiualize duration vs time (unix convert to current local time)
  // 2. Bubble size corresponds to number of spans 
  // 3. Errors appear as red bubbles 
  
  // JZ Question how are we going to call a the DataQueriesProvider to get our query if we 
  // don't know what QueryType it is (e.g. TraceQuery or TimeSeriesQuery). 
  // Would there ever be an instance were there is a a panel that has BOTH 
  // a TraceQuery and TimeSeriesQuery. Isn't it mutally exclusive -- you either have 
  // TraceQuery OR a TimeSeriesQuery?
  const { queryResults: traceResults, isLoading: traceIsLoading, error } = useDataQueries('TraceQuery');
  const { queryResults: timeSeriesResults } = useDataQueries('TimeSeriesQuery');

  console.log('JZ /apple traceResults: ', traceResults)
  console.log('JZ /apple traceResults[0].data: ', traceResults[0].data)
  console.log('JZ /apple traceResults.data: ', traceResults.data)
  console.log('JZ /apple timeSeriesResults: ', timeSeriesResults)
  // console.log('JZ /apple from useTimeSeriesQuery >  data: ', JSON.stringify(data, null, 2) )


  // const scatterData = useMemo(() => {
  //   if (data === undefined) {
  //     return [];
  //   }
  //   const seriesData: ScatterSeriesOption[] = [];
  //   for (const timeSeries of data.series) {
  //     const formattedSeriesName = timeSeries.formattedName ?? timeSeries.name;
  //     let timeSeriesValues = [['timestamp', 'value'], ...timeSeries.values];
  //     const scatterSeries: ScatterSeriesOption = {
  //       type: 'scatter', // https://echarts.apache.org/en/option.html#series-scatter.type
  //       name: formattedSeriesName,
  //       data: timeSeriesValues,
  //       symbolSize: 4,
  //     };
  //     seriesData.push(scatterSeries);
  //   }
  //   console.log('JZ /pie seriesData: ', seriesData);
  //   return seriesData;
  // }, [data]);


  //   /**
  //  * formatTimeStamp() - converts Tempo trace data attribute 'startTimeUnixNano'
  //  * into Coordinated Universal Time (UTC)
  //  */
  // function formatTimeStamp(nanosecondsStr: string) {

  //   const nanoseconds = parseInt(nanosecondsStr)
  //   const miliseconds = nanoseconds * 1e-6

  //   const dtFormat = new Intl.DateTimeFormat('en-GB', {
  //     timeStyle: 'medium',
  //     timeZone: 'UTC'
  //   });

  //   return dtFormat.format(new Date(miliseconds));
  // }

  function convertNanoToMiliseconds(nanosecondsStr: string){
    const nanoseconds = parseInt(nanosecondsStr)
    const miliseconds = nanoseconds * 1e-6
    return miliseconds
  }

  let yAxisMax = 0;
  const scatterTraceData = useMemo(() => {
    const traceData = traceResults[0].data
    if (traceData === undefined) {
      return [];
    }

    const seriesData: ScatterSeriesOption[] = [];
    const traceDurations = []
    for (let trace of traceData.traces) {
        const startTime = convertNanoToMiliseconds(trace.startTimeUnixNano)
        const duration =  trace.durationMs
        if (duration > yAxisMax){
          yAxisMax = duration;
        }
        traceDurations.push([startTime, duration])
    }

    console.log('JZ /pie traceDurations[] ', traceDurations)

    let traceDurationData = [['timestamp', 'value'], ...traceDurations];
    const scatterSeries: ScatterSeriesOption = {
      type: 'scatter', // https://echarts.apache.org/en/option.html#series-scatter.type
      name: "test",
      data: traceDurationData,
      symbolSize: 20,
    };
    seriesData.push(scatterSeries);
    console.log('JZ /pie traceSeriesData , ', seriesData)
    return seriesData;
  }, [traceIsLoading]);

  console.log('JZ /max ', yAxisMax)

  // console.log('JZ scatterData : ', JSON.stringify(scatterData, null, 2));

  console.log('JZ scatterTraceData : ', JSON.stringify(scatterTraceData, null, 2));


  if (error) throw error;

  if (contentDimensions === undefined) return null;

  if (traceIsLoading === true) {
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
    <Scatterplot width={contentDimensions.width} height={contentDimensions.height} data={scatterTraceData} yAxisMax={yAxisMax}/>
  );
}
