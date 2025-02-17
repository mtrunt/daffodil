import { daffArrayToDict } from '@daffodil/core';

import { DaffProductFilterEqualOption } from '../../../../models/public_api';

/**
 * Converts a list of product equal filter options to a dict of options keyed by option value.
 */
export const daffProductFilterEqualOptionArrayToDict =
  (options: DaffProductFilterEqualOption[]): Record<DaffProductFilterEqualOption['value'], DaffProductFilterEqualOption> =>
    daffArrayToDict(options, option => option.value);
