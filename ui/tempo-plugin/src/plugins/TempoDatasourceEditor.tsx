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

import { RequestHeaders } from '@perses-dev/core';
import { OptionsEditorRadios } from '@perses-dev/plugin-system';
import { Grid, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import { Fragment, useState } from 'react';
import { produce } from 'immer';
import MinusIcon from 'mdi-material-ui/Minus';
import PlusIcon from 'mdi-material-ui/Plus';
import { TempoDatasourceSpec } from './types';

export interface TempoDatasourceEditorProps {
  value: TempoDatasourceSpec;
  onChange: (next: TempoDatasourceSpec) => void;
  isReadonly?: boolean;
}

export function TempoDatasourceEditor(props: TempoDatasourceEditorProps) {
  const { value, onChange, isReadonly } = props;
  const strDirect = 'Direct access';
  const strProxy = 'Proxy';

  // utilitary function used for headers when renaming a property
  // -> TODO it would be cleaner to manipulate headers as an intermediary list instead, to avoid doing this.
  const buildNewHeaders = (oldHeaders: RequestHeaders | undefined, oldName: string, newName: string) => {
    if (oldHeaders === undefined) return oldHeaders;
    const keys = Object.keys(oldHeaders);
    const newHeaders = keys.reduce<Record<string, string>>((acc, val) => {
      if (val === oldName) {
        acc[newName] = oldHeaders[oldName] || '';
      } else {
        acc[val] = oldHeaders[val] || '';
      }
      return acc;
    }, {});

    return { ...newHeaders };
  };

  const tabs = [
    {
      label: strDirect,
      content: (
        <>
          <TextField
            fullWidth
            label="URL"
            value={value.directUrl || ''}
            InputProps={{
              readOnly: isReadonly,
            }}
            InputLabelProps={{ shrink: isReadonly ? true : undefined }}
            onChange={(e) => {
              onChange(
                produce(value, (draft) => {
                  draft.directUrl = e.target.value;
                })
              );
            }}
          />
        </>
      ),
    },
    {
      label: strProxy,
      content: (
        <>
          <TextField
            fullWidth
            label="URL"
            value={value.proxy?.spec.url || ''}
            InputProps={{
              readOnly: isReadonly,
            }}
            InputLabelProps={{ shrink: isReadonly ? true : undefined }}
            onChange={(e) => {
              onChange(
                produce(value, (draft) => {
                  if (draft.proxy !== undefined) {
                    draft.proxy.spec.url = e.target.value;
                  }
                })
              );
            }}
            sx={{ mb: 2 }}
          />
          <Typography variant="h4" mb={2}>
            Allowed endpoints
          </Typography>
          <Grid container spacing={2} mb={2}>
            {value.proxy?.spec.allowedEndpoints && value.proxy?.spec.allowedEndpoints.length != 0 ? (
              value.proxy.spec.allowedEndpoints.map(({ endpointPattern, method }, i) => {
                return (
                  <Fragment key={i}>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        label="Endpoint pattern"
                        value={endpointPattern}
                        InputProps={{
                          readOnly: isReadonly,
                        }}
                        InputLabelProps={{ shrink: isReadonly ? true : undefined }}
                        onChange={(e) => {
                          onChange(
                            produce(value, (draft) => {
                              if (draft.proxy !== undefined) {
                                draft.proxy.spec.allowedEndpoints = draft.proxy.spec.allowedEndpoints?.map(
                                  (item, itemIndex) => {
                                    if (i === itemIndex) {
                                      return {
                                        endpointPattern: e.target.value,
                                        method: item.method,
                                      };
                                    } else {
                                      return item;
                                    }
                                  }
                                );
                              }
                            })
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        select
                        fullWidth
                        label="Method"
                        value={method}
                        InputProps={{
                          readOnly: isReadonly,
                        }}
                        InputLabelProps={{ shrink: isReadonly ? true : undefined }}
                        onChange={(e) => {
                          onChange(
                            produce(value, (draft) => {
                              if (draft.proxy !== undefined) {
                                draft.proxy.spec.allowedEndpoints = draft.proxy.spec.allowedEndpoints?.map(
                                  (item, itemIndex) => {
                                    if (i === itemIndex) {
                                      return {
                                        endpointPattern: item.endpointPattern,
                                        method: e.target.value,
                                      };
                                    } else {
                                      return item;
                                    }
                                  }
                                );
                              }
                            })
                          );
                        }}
                      >
                        <MenuItem value="GET">GET</MenuItem>
                        <MenuItem value="POST">POST</MenuItem>
                        <MenuItem value="PUT">PUT</MenuItem>
                        <MenuItem value="PATCH">PATCH</MenuItem>
                        <MenuItem value="DELETE">DELETE</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                        disabled={isReadonly}
                        // Remove the given allowed endpoint from the list
                        onClick={() => {
                          onChange(
                            produce(value, (draft) => {
                              if (draft.proxy !== undefined) {
                                draft.proxy.spec.allowedEndpoints = [
                                  ...(draft.proxy.spec.allowedEndpoints?.filter((item, itemIndex) => {
                                    return itemIndex !== i;
                                  }) || []),
                                ];
                              }
                            })
                          );
                        }}
                      >
                        <MinusIcon />
                      </IconButton>
                    </Grid>
                  </Fragment>
                );
              })
            ) : (
              <Grid item xs={4}>
                <Typography sx={{ fontStyle: 'italic' }}>None</Typography>
              </Grid>
            )}
            <Grid item xs={12} sx={{ paddingTop: '0px !important', paddingLeft: '5px !important' }}>
              <IconButton
                disabled={isReadonly}
                // Add a new (empty) allowed endpoint to the list
                onClick={() =>
                  onChange(
                    produce(value, (draft) => {
                      if (draft.proxy !== undefined) {
                        draft.proxy.spec.allowedEndpoints = [
                          ...(draft.proxy.spec.allowedEndpoints ?? []),
                          { endpointPattern: '', method: '' },
                        ];
                      }
                    })
                  )
                }
              >
                <PlusIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Typography variant="h4" mb={2}>
            Request Headers
          </Typography>
          <Grid container spacing={2} mb={2}>
            {value.proxy?.spec.headers &&
              Object.keys(value.proxy.spec.headers).map((headerName, i) => {
                return (
                  <Fragment key={i}>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Header name"
                        value={headerName}
                        InputProps={{
                          readOnly: isReadonly,
                        }}
                        InputLabelProps={{ shrink: isReadonly ? true : undefined }}
                        onChange={(e) =>
                          onChange(
                            produce(value, (draft) => {
                              if (draft.proxy !== undefined) {
                                draft.proxy.spec.headers = buildNewHeaders(
                                  draft.proxy.spec.headers,
                                  headerName,
                                  e.target.value
                                );
                              }
                            })
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        fullWidth
                        label="Header value"
                        value={value.proxy?.spec.headers?.[headerName]}
                        InputProps={{
                          readOnly: isReadonly,
                        }}
                        InputLabelProps={{ shrink: isReadonly ? true : undefined }}
                        onChange={(e) =>
                          onChange(
                            produce(value, (draft) => {
                              if (draft.proxy !== undefined) {
                                draft.proxy.spec.headers = {
                                  ...draft.proxy.spec.headers,
                                  [headerName]: e.target.value,
                                };
                              }
                            })
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                        disabled={isReadonly}
                        // Remove the given header from the list
                        onClick={() => {
                          const newHeaders = { ...value.proxy?.spec.headers };
                          delete newHeaders[headerName];
                          onChange(
                            produce(value, (draft) => {
                              if (draft.proxy !== undefined) {
                                draft.proxy.spec.headers = newHeaders;
                              }
                            })
                          );
                        }}
                      >
                        <MinusIcon />
                      </IconButton>
                    </Grid>
                  </Fragment>
                );
              })}
            <Grid item xs={12} sx={{ paddingTop: '0px !important', paddingLeft: '5px !important' }}>
              <IconButton
                disabled={isReadonly}
                // Add a new (empty) header to the list
                onClick={() =>
                  onChange(
                    produce(value, (draft) => {
                      if (draft.proxy !== undefined) {
                        draft.proxy.spec.headers = { ...draft.proxy.spec.headers, '': '' };
                      }
                    })
                  )
                }
              >
                <PlusIcon />
              </IconButton>
            </Grid>
          </Grid>
          <TextField
            fullWidth
            label="Secret"
            value={value.proxy?.spec.secret || ''}
            InputProps={{
              readOnly: isReadonly,
            }}
            InputLabelProps={{ shrink: isReadonly ? true : undefined }}
            onChange={(e) => {
              onChange(
                produce(value, (draft) => {
                  if (draft.proxy !== undefined) {
                    draft.proxy.spec.secret = e.target.value;
                  }
                })
              );
            }}
          />
        </>
      ),
    },
  ];

  // Use of findIndex instead of providing hardcoded values to avoid desynchronisatio or
  // bug in case the tabs get eventually swapped in the future.
  const directModeId = tabs.findIndex((tab) => tab.label == strDirect);
  const proxyModeId = tabs.findIndex((tab) => tab.label == strProxy);

  // In "update datasource" case, set defaultTab to the mode that this datasource is currently relying on.
  // Otherwise (create datasource), set defaultTab to Direct access.
  const defaultTab = value.proxy ? proxyModeId : directModeId;

  const initialSpecDirect: TempoDatasourceSpec = {
    directUrl: '',
  };

  const initialSpecProxy: TempoDatasourceSpec = {
    proxy: {
      kind: 'HTTPProxy',
      spec: {
        allowedEndpoints: [
          // list of standard endpoints suggested by default
        ],
        url: '',
      },
    },
  };

  // For better user experience, save previous states in mind for both mode.
  // This avoids losing everything when the user changes their mind back.
  const [previousSpecDirect, setPreviousSpecDirect] = useState(initialSpecDirect);
  const [previousSpecProxy, setPreviousSpecProxy] = useState(initialSpecProxy);

  // When changing mode, remove previous mode's config + append default values for the new mode.
  const handleModeChange = (v: number) => {
    if (tabs[v]?.label == strDirect) {
      setPreviousSpecProxy(value);
      onChange(previousSpecDirect);
    } else if (tabs[v]?.label == strProxy) {
      setPreviousSpecDirect(value);
      onChange(previousSpecProxy);
    }
  };

  return (
    <>
      <Typography variant="h4" mb={2}>
        General Settings
      </Typography>
      <Typography variant="h4" mt={2}>
        HTTP Settings
      </Typography>
      <OptionsEditorRadios
        isReadonly={isReadonly}
        tabs={tabs}
        defaultTab={defaultTab}
        onModeChange={handleModeChange}
      />
    </>
  );
}