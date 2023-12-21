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

import { PanelProps, useDataQueries, useTimeRange } from '@perses-dev/plugin-system';
import { Box, Skeleton } from '@mui/material';
import { useMemo } from 'react';
import { AbsoluteTimeRange, TraceValue } from '@perses-dev/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { ErrorAlert } from '@perses-dev/components';
import { getUnixTime } from 'date-fns';
import { Scatterplot } from './Scatterplot';
import { ScatterChartOptions } from './scatter-chart-model';

export interface EChartTraceValue extends Omit<TraceValue, 'startTimeUnixMs'> {
  startTime: Date;
}

export function getUnixTimeRange(timeRange: AbsoluteTimeRange) {
  const { start, end } = timeRange;
  return {
    start: Math.ceil(getUnixTime(start)),
    end: Math.ceil(getUnixTime(end)),
  };
}

const generateErrorAlert = (message: string) => {
  const alertMessage = {
    name: message,
    message: message,
  };
  return (
    <div data-testid="ScatterChartPanel_ErrorAlert">
      <ErrorAlert error={alertMessage} />
    </div>
  );
};

export type ScatterChartPanelProps = PanelProps<ScatterChartOptions>;

/**
 * ScatterChartPanel receives data from the DataQueriesProvider and transforms it
 * into a `dataset` object that Apache ECharts can consume. Additionally,
 * data formatting is also dictated in this component. Formatting includes 
 * datapoint size and color. 
 * 
 * Documentation for data structures accepted by Apache ECharts:
 *  https://echarts.apache.org/handbook/en/concepts/dataset
 * 
 * Examples for scatter chart formatting in Apache ECharts: 
 *  https://echarts.apache.org/examples/en/index.html#chart-type-scatter
 *
 * @returns a `ScatterPlot` component that contains an EChart which will handle
 * visuzliation of the data.
 */
export function ScatterChartPanel(props: ScatterChartPanelProps) {
  const { contentDimensions, definition } = props;
  const { absoluteTimeRange } = useTimeRange();
  const { queryResults: traceResults, isLoading: traceIsLoading } = useDataQueries('TraceQuery');
  const queries = definition?.spec?.queries;

  // Generate dataset
  // Transform Tempo API response to fit 'dataset' structure from Apache ECharts
  // https://echarts.apache.org/handbook/en/concepts/dataset
  const dataset = useMemo(() => {
    const traceData = traceResults[0]?.data;
    if (traceIsLoading || traceData === undefined) {
      return [];
    }
    const dataset = [];
    for (const result of traceResults) {
      if (traceIsLoading || traceData === undefined) {
        return [];
      }
      if (result.isLoading || result.data === undefined) continue;
      const dataSeries = result.data.traces.map((trace) => {
        const newTraceValue: EChartTraceValue = {
          ...trace,
          startTime: new Date(trace.startTimeUnixMs), // convert unix epoch time to Date
        };
        return newTraceValue;
      });
      dataset.push({
        source: dataSeries,
      });
    }
    return dataset;
  }, [traceIsLoading, traceResults]);

  // Error check: Tempo API only supports queries from the past 7 days (as of Dec. 17, 2023)
  const containsTempoQuery = () => {
    let isTempoQuery = false;
    queries?.forEach((query) => {
      if (query.spec.plugin.kind === 'TempoTraceQuery') {
        isTempoQuery = true;
      }
    });
    return isTempoQuery;
  };
  const isGreaterThanSevenDays = (): boolean => {
    const { start, end } = getUnixTimeRange(absoluteTimeRange);
    const sevenDays = 604800;
    return end - start > sevenDays;
  };
  if (isGreaterThanSevenDays() === true && containsTempoQuery() === true) {
    return generateErrorAlert('Tempo queries can not exceed a time range of 7 days.');
  }

  // Error check: specify an alert if no traces are returned from the query
  const traceData = traceResults[0]?.data;
  if (!traceIsLoading && traceData?.traces.length === 0) {
    const query = traceData?.metadata?.executedQueryString;
    return generateErrorAlert(`No traces found for the query : " ${query} " .`);
  }

  // Formatting for the dataset
  // 1. Map x,y coordinates
  // 2. Datapoint size corresponds to the number of spans in a trace
  // 3. Color datapoint red if the trace contains an error
  const seriesTemplate: SeriesOption = {
    type: 'scatter',
    encode: {
      // Map to x-axis.
      x: 'startTime',
      // Map to y-axis.
      y: 'durationMs',
    },
    symbolSize: function (data) {
      // Changes datapoint to correspond to number of spans in a trace
      const scaleSymbolSize = 10;
      return data.spanCount * scaleSymbolSize;
    },
    itemStyle: {
      color: function (params) {
        const traceData: EChartTraceValue = params.data as EChartTraceValue;
        // If the trace contains an error, color the datapoint in red
        if (traceData.errorCount !== undefined && traceData.errorCount > 0) {
          return 'red';
        }
        // Else return default color
        const defaultColor = '#56B4E9';
        return defaultColor;
      },
    },
  };

  // Each data set needs to have a corresponding series formatting object
  const series = [];
  for (let i = 0; i < dataset.length; i++) {
    series.push({ ...seriesTemplate, datasetIndex: i });
  }

  const options: EChartsOption = {
    dataset: dataset,
    series: series,
  };

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
    <div data-testid="ScatterChartPanel_ScatterPlot">
      <Scatterplot width={contentDimensions.width} height={contentDimensions.height} options={options} />;
    </div>
  );
}
