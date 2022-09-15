// Copyright 2021 The Perses Authors
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

// Eagerly load the metadata for the bundled plugins, but lazy-load the plugins
import prometheusResource from '@perses-dev/prometheus-plugin/plugin.json';
import panelsResource from '@perses-dev/panels-plugin/plugin.json';
import { PluginRegistryProps, PluginModuleResource } from '@perses-dev/plugin-system';
import { useCallback } from 'react';

interface BundledPlugin {
  importPluginModule: () => Promise<unknown>;
}

/**
 * Plugins that are bundled with the app via code-splitting.
 */
const BUNDLED_PLUGINS = new Map<PluginModuleResource, BundledPlugin>();
BUNDLED_PLUGINS.set(prometheusResource as PluginModuleResource, {
  importPluginModule: () => import('@perses-dev/prometheus-plugin'),
});
BUNDLED_PLUGINS.set(panelsResource as PluginModuleResource, {
  importPluginModule: () => import('@perses-dev/panels-plugin'),
});

/**
 * Returns props for the PluginRegistry allowing it to load plugins that are bundled with the app.
 */
export function useBundledPlugins(): Pick<PluginRegistryProps, 'getInstalledPlugins' | 'importPluginModule'> {
  const getInstalledPlugins: PluginRegistryProps['getInstalledPlugins'] = useCallback(
    () => Promise.resolve(Array.from(BUNDLED_PLUGINS.keys())),
    []
  );

  const importPluginModule: PluginRegistryProps['importPluginModule'] = useCallback((resource) => {
    const bundled = BUNDLED_PLUGINS.get(resource);
    if (bundled === undefined) {
      throw new Error('Plugin not found');
    }
    return bundled.importPluginModule();
  }, []);

  return { getInstalledPlugins, importPluginModule };
}
