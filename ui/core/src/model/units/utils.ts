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

export function shouldShortenValues(shortValues?: boolean): boolean {
  return shortValues !== false;
}

export function hasDecimalPlaces(decimalPlaces?: number): boolean {
  return typeof decimalPlaces === 'number';
}

// Avoids maximumFractionDigits out-of-range error.
// Allowed values are 0 to 20.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#maximumfractiondigits
export function limitDecimalPlaces(num?: number): number | undefined {
  if (!num) return num;

  if (num < 0) {
    num = 0;
  } else if (num > 20) {
    num = 20;
  }

  return num;
}
