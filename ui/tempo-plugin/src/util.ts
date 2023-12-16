import { getUnixTime } from 'date-fns';
import { AbsoluteTimeRange } from '@perses-dev/core';

export function getUnixTimeRange(timeRange: AbsoluteTimeRange) {
    const { start, end } = timeRange;
    return {
      start: Math.ceil(getUnixTime(start)),
      end: Math.ceil(getUnixTime(end)),
    };
}