import { ActionReducerMap } from '@ngrx/store';

import { daffCategoryEntitiesReducer } from './category-entities/category-entities.reducer';
import { DaffCategoryReducersState } from './category-reducers.interface';
import { daffCategoryReducer } from './category/category.reducer';
import { daffCategoryPageMetadataReducer } from './page-metadata/reducer';

/**
 * All daffodil defined category reducers.
 */
export const daffCategoryReducers: ActionReducerMap<DaffCategoryReducersState> = {
  category: daffCategoryReducer,
  categoryEntities: daffCategoryEntitiesReducer,
  pageMetadata: daffCategoryPageMetadataReducer,
};
