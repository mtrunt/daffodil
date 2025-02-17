import { DaffSearchResult } from '@daffodil/search';

import {
  DaffSearchActions,
  DaffSearchActionTypes,
} from '../../actions/search.actions';
import {
  daffSearchInitialState,
  DaffSearchReducerState,
  DaffSearchStateReducerAdapter,
} from '../search/public_api';

/**
 * The reducer for the incremental part of search state, see {@link DaffSearchReducerState}.
 */
export function daffSearchIncrementalReducer<T extends DaffSearchResult = DaffSearchResult>(
  state = daffSearchInitialState,
  action: DaffSearchActions<T>,
): DaffSearchReducerState {
  const adapter = new DaffSearchStateReducerAdapter(state);
  switch (action.type) {
    case DaffSearchActionTypes.SearchIncrementalAction:
      return adapter.search(action.query);

    case DaffSearchActionTypes.SearchIncrementalSuccessAction:
      return adapter.storeResults(action.payload.collection);

    case DaffSearchActionTypes.SearchIncrementalFailureAction:
      return adapter.storeError(action.payload);

    default:
      return state;
  }
}
