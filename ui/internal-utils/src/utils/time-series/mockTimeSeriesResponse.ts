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

import { MatrixData } from '@perses-dev/prometheus-plugin';

type MockResponse = {
  status: string;
  data: Record<string, unknown>;
};

type MockStableValueResultConfig = {
  metric: Record<string, string>;
  value: string;
};

type MockStableValueConfig = {
  metrics: MockStableValueResultConfig[];
  startTimeMs: number;
  endTimeMs: number;
  count?: number;
};

function mockSuccessfulTimeSeriesResponse(result: MatrixData['result']): MockResponse {
  return {
    status: 'success',
    data: {
      resultType: 'matrix',
      result,
    },
  };
}

export function mockTimeSeriesResponseWithStableValue({
  metrics,
  startTimeMs,
  endTimeMs,
  count = 1000,
}: MockStableValueConfig): MockResponse {
  // Taking time in as milliseconds because that's the unit generated by Date.now
  // in JS (i.e. mostly what the test code is going). Converting to seconds because
  // that's the unit used in prometheus responses.
  const startTimeS = Math.floor(startTimeMs / 1000);
  const endTimeS = Math.floor(endTimeMs / 1000);
  const stepSize = Math.floor((endTimeS - startTimeS) / count);

  return mockSuccessfulTimeSeriesResponse(
    metrics.map(({ metric, value }) => {
      return {
        metric,
        values: [...Array(count)].map((_, i) => {
          // Use the end time for the last item to make sure we include it in
          // cases where the step size would lead to a lower value because of
          // rounding.
          const timestamp = i < count - 1 ? startTimeS + i * stepSize : endTimeS;

          return [timestamp, value];
        }),
      };
    })
  );
}

// Testing TimeSeriesQuery plugins that can return null values

type MockNullValueConfig = {
  startTimeMs: number;
  endTimeMs: number;
  count?: number;
};

export function mockTimeSeriesResponseWithNullValues({
  startTimeMs,
  endTimeMs,
  count = 1000,
}: MockNullValueConfig): MockResponse {
  const startTimeS = Math.floor(startTimeMs / 1000);
  const endTimeS = Math.floor(endTimeMs / 1000);
  const stepSize = Math.floor((endTimeS - startTimeS) / count);

  return mockSuccessfulTimeSeriesResponse([
    {
      metric: {},
      values: [...Array(count)].map((_, i) => {
        const timestamp = i < count - 1 ? startTimeS + i * stepSize : endTimeS;
        let value: string | null = '100';
        // to test visual.connect_nulls option
        if (i > 50 && i < 100) {
          value = null;
        }
        // TODO: fix types when graphite datasource added
        return [timestamp, value as string];
      }),
    },
  ]);
}