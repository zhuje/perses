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

import { useDataQueries } from "@perses-dev/plugin-system";
import { Box } from '@mui/material';


export function JsonChartPanel(){
    
  // JZ TODO: REMOVE THIS HACK -- it displays TraceQuery responses 
  const { queryResults: traceResults, isLoading: traceIsLoading, isFetching: traceIsFetching } = useDataQueries('TraceQuery');
  const traceStr = JSON.stringify(traceResults, null, 3)
  console.log('JZ /dashboard-defintion MarkDownPanel > traceStr : ', traceStr)



  return (
    <Box
        sx={{
        mb: 2,
        display: "flex",
        flexDirection: "column",
        height: 700,
        overflow: "hidden",
        overflowY: "scroll",
        }}
    >
        <pre>{traceStr}</pre>
    </Box>
  )
    
}