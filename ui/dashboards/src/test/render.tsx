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

import { ChartsProvider, SnackbarProvider, testChartsTheme } from '@perses-dev/components';
import { mockPluginRegistry, PluginRegistry } from '@perses-dev/plugin-system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import { ReactElement, useLayoutEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { GenericDatasourceResource } from '@perses-dev/core';
import { DatasourceStoreProvider } from '../context';
import { MOCK_PLUGINS } from './plugin-registry';
import { prometheusDemo } from './datasource-provider';

interface CustomRouterProps {
  history: MemoryHistory;
  children: React.ReactNode;
}

/*
 * Workaround for React router upgrade type errors.
 * More details: https://stackoverflow.com/a/69948457/17575201
 */
const CustomRouter: React.FC<CustomRouterProps> = ({ history, children }) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router location={state.location} navigationType={state.action} navigator={history}>
      {children}
    </Router>
  );
};

/**
 * Test helper to render a React component with some common app-level providers wrapped around it.
 */
export function renderWithContext(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
  history?: MemoryHistory
): RenderResult {
  // Create a new QueryClient for each test to avoid caching issues
  const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } } });

  const customHistory = history ?? createMemoryHistory();

  const mockRegistry = mockPluginRegistry(...MOCK_PLUGINS);

  const BaseRender = (): ReactElement => (
    <CustomRouter history={customHistory}>
      <QueryClientProvider client={queryClient}>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <ChartsProvider chartsTheme={testChartsTheme}>
              <PluginRegistry
                pluginLoader={mockRegistry.pluginLoader}
                defaultPluginKinds={mockRegistry.defaultPluginKinds}
              >
                <DatasourceStoreProvider datasources={[prometheusDemo as GenericDatasourceResource]}>
                  {ui}
                </DatasourceStoreProvider>
              </PluginRegistry>
            </ChartsProvider>
          </SnackbarProvider>
        </QueryParamProvider>
      </QueryClientProvider>
    </CustomRouter>
  );

  return render(<BaseRender />, options);
}
