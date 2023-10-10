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

import { TimeSeriesData } from '@perses-dev/core';

export const MOCK_TIME_SERIES_DATA: TimeSeriesData = {
  timeRange: {
    start: new Date(1666625490000),
    end: new Date(1666625535000),
  },
  stepMs: 24379,
  series: [
    {
      name: 'device="/dev/vda1", env="demo", fstype="ext4", instance="demo.do.prometheus.io:9100", job="node", mountpoint="/"',
      values: [
        [1666479357903, 0.27700745551584494],
        [1666479382282, 0.27701284657366565],
      ],
    },
    {
      name: 'device="/dev/vda15", env="demo", fstype="vfat", instance="demo.do.prometheus.io:9100", job="node", mountpoint="/boot/efi"',
      values: [
        [1666479357903, 0.08486496097624885],
        [1666479382282, 0.08486496097624885],
      ],
    },
  ],
};

export const MOCK_TRACE_DATA = {
  traceID: "1234",
  rootServiceName: "fooServiceName",
  rootTraceName: "barTraceName",
  startTimeUnixNano: "5678",
  durationMs: "90",
};

export const MOCK_TRACE_USE_QUERY = {
  "current": {
     "status": "success",
     "fetchStatus": "idle",
     "isLoading": false,
     "isSuccess": true,
     "isError": false,
     "data": {
        "traces": [
           {
              "traceID": "2718ad0aabf9ee0dfbd305c5897fd9b3",
              "rootServiceName": "shop-backend",
              "rootTraceName": "article-to-cart",
              "startTimeUnixNano": "1696881980949604116",
              "durationMs": 1114
           },
           {
              "traceID": "1c0d47cb11048a7c46f4d962f23c36bb",
              "rootServiceName": "shop-backend",
              "rootTraceName": "article-to-cart",
              "startTimeUnixNano": "1696881970940694808",
              "durationMs": 844
           },
           {
              "traceID": "1f73563f289598cb2ea2c0881c2cf01f",
              "rootServiceName": "shop-backend",
              "rootTraceName": "send-shipping",
              "startTimeUnixNano": "1696881968939879767",
              "durationMs": 743
           },
           {
              "traceID": "3a15ebe60df55f59400e43ae7a75abf3",
              "rootServiceName": "shop-backend",
              "rootTraceName": "send-shipping",
              "startTimeUnixNano": "1696881923922587253",
              "durationMs": 712
           },
           {
              "traceID": "1b5ffdd00a56c9bafea43fbcac302940",
              "rootServiceName": "shop-backend",
              "rootTraceName": "send-shipping",
              "startTimeUnixNano": "1696881920919863993",
              "durationMs": 665
           },
           {
              "traceID": "d08d84d454bc8dac533f8ee7f1010ec",
              "rootServiceName": "shop-backend",
              "rootTraceName": "send-shipping",
              "startTimeUnixNano": "1696881917912834004",
              "durationMs": 538
           },
           {
              "traceID": "205c1fd7ef16d477dca62154843a714",
              "rootServiceName": "shop-backend",
              "rootTraceName": "send-shipping",
              "startTimeUnixNano": "1696881907910259181",
              "durationMs": 708
           },
           {
              "traceID": "2cca597ff317c6b4ecbceff189229b61",
              "rootServiceName": "shop-backend",
              "rootTraceName": "list-articles",
              "startTimeUnixNano": "1696881902908936417",
              "durationMs": 564
           },
           {
              "traceID": "132b200948ee8536fd857ad7ff2b6592",
              "rootServiceName": "shop-backend",
              "rootTraceName": "send-shipping",
              "startTimeUnixNano": "1696881891904882519",
              "durationMs": 624
           },
           {
              "traceID": "39500012ebf9f2266cb98a9d891d4a8b",
              "rootServiceName": "shop-backend",
              "rootTraceName": "send-shipping",
              "startTimeUnixNano": "1696881870890051875",
              "durationMs": 649
           },
           {
              "traceID": "c353eb4ccddfafbda55cd130ad38c67",
              "rootServiceName": "shop-backend",
              "rootTraceName": "list-articles",
              "startTimeUnixNano": "1696881859883598591",
              "durationMs": 691
           },
           {
              "traceID": "3a7a8a80b4ff4e8f5b648a32c5531712",
              "rootServiceName": "shop-backend",
              "rootTraceName": "list-articles",
              "startTimeUnixNano": "1696881839872258390",
              "durationMs": 803
           },
           {
              "traceID": "c17aa82e4d249b0b9084a9c063ca2e6",
              "rootServiceName": "shop-backend",
              "rootTraceName": "send-shipping",
              "startTimeUnixNano": "1696881824861208878",
              "durationMs": 777
           },
           {
              "traceID": "1ab6d85de0fa0f3d5be9c0bc53404f69",
              "rootServiceName": "shop-backend",
              "rootTraceName": "article-to-cart",
              "startTimeUnixNano": "1696881791831666285",
              "durationMs": 1042
           },
           {
              "traceID": "2a9d706b684503c84056e437c224dfd1",
              "rootServiceName": "shop-backend",
              "rootTraceName": "article-to-cart",
              "startTimeUnixNano": "1696881777820312300",
              "durationMs": 455
           },
           {
              "traceID": "3c190b2cd079607fc385a632df5e6042",
              "rootServiceName": "shop-backend",
              "rootTraceName": "article-to-cart",
              "startTimeUnixNano": "1696881765814424549",
              "durationMs": 639
           },
           {
              "traceID": "2a92d6516e50d5fff5adf5d8a331bb6d",
              "rootServiceName": "shop-backend",
              "rootTraceName": "article-to-cart",
              "startTimeUnixNano": "1696881761813508011",
              "durationMs": 409
           },
           {
              "traceID": "bc38c5ec38d3f53790d540159ff03e7",
              "rootServiceName": "shop-backend",
              "rootTraceName": "list-articles",
              "startTimeUnixNano": "1696881734349513203",
              "durationMs": 437
           },
           {
              "traceID": "20deeab5e59db84ff10a86c823485e72",
              "rootServiceName": "shop-backend",
              "rootTraceName": "list-articles",
              "startTimeUnixNano": "1696881704331880026",
              "durationMs": 335
           },
           {
              "traceID": "257c841359d130752ccac2dc823b8e9a",
              "rootServiceName": "shop-backend",
              "rootTraceName": "list-articles",
              "startTimeUnixNano": "1696881692322296533",
              "durationMs": 802
           }
        ],
        "metrics": {
           "completedJobs": 1,
           "totalJobs": 1
        }
     },
     "dataUpdatedAt": 1696882143892,
     "error": null,
     "errorUpdatedAt": 0,
     "failureCount": 0,
     "errorUpdateCount": 0,
     "isFetched": true,
     "isFetchedAfterMount": true,
     "isFetching": false,
     "isRefetching": false,
     "isLoadingError": false,
     "isPaused": false,
     "isPlaceholderData": false,
     "isPreviousData": false,
     "isRefetchError": false,
     "isStale": true
  }
}

