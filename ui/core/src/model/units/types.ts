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

// Common types needed across individual unit groups and the overall combined
// units.

import { Duration } from 'date-fns';
import { AbsoluteTimeRange, DurationString } from '../time';
import { FormatOptions } from './units';

export type UnitGroup = 'Time' | 'Percent' | 'Decimal' | 'Bytes' | 'Throughput';

/**
 * Configuration for rendering units that are part of a group.
 */
export type UnitGroupConfig = {
  /**
   * The label that is shown in the UI.
   */
  label: string;
  /**
   * When true, the unit group supports setting decimal places.
   */
  decimalPlaces?: boolean;
  /**
   * When true, the unit group supports enabling shortValues.
   */
  shortValues?: boolean;
};

/**
 * Configuration for rendering a specific unit.
 */
export type UnitConfig = {
  /**
   * The group the unit is part of. This will inform common rendering behavior.
   */
  group?: UnitGroup;

  /**
   * When true, this unit will not be displayed in the unit selector. This is
   * useful for units that are shorthand variants of other units.
   */
  disableSelectorOption?: boolean;

  /**
   * The label that is shown in the UI.
   */
  label: string;
};

/**
 * Used in the tests for each type of unit.
 */
export interface UnitTestCase {
  value: number;
  format: FormatOptions;
  expected: string;
}

export interface IntervalTestCase {
  timeRange: AbsoluteTimeRange;
  expected: Duration;
}

export interface FormatTestCase {
  duration: Duration;
  expected: DurationString;
}
