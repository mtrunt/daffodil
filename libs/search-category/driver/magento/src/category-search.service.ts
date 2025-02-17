import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  Observable,
  throwError,
} from 'rxjs';
import {
  catchError,
  map,
} from 'rxjs/operators';

import { DaffMagentoCategoryTransformerService } from '@daffodil/category/driver/magento';
import { daffSearchTransformResultsToCollection } from '@daffodil/search';
import {
  DaffSearchCategoryResult,
  daffTransformCategoriesToSearchResults,
  DAFF_SEARCH_CATEGORY_RESULT_KIND,
} from '@daffodil/search-category';
import { DaffSearchCategoryDriverInterface } from '@daffodil/search-category/driver';
import {
  DaffSearchDriverOptions,
  DaffSearchDriverResponse,
} from '@daffodil/search/driver';

import { transformSearchCategoryMagentoError } from './errors/transform';
import { MagentoSearchForCategoriesResponse } from './models/public_api';
import { categorySearch } from './queries/category-search';

/**
 * A service for searching categories in Magento.
 *
 * @inheritdoc
 */
@Injectable({
  providedIn: 'root',
})
export class DaffSearchCategoryMagentoDriver implements DaffSearchCategoryDriverInterface {
  constructor(
    private apollo: Apollo,
    private magentoCategoryTransformerService: DaffMagentoCategoryTransformerService,
  ) {}

  kind = DAFF_SEARCH_CATEGORY_RESULT_KIND;

  search(query: string, options: DaffSearchDriverOptions = {}): Observable<DaffSearchDriverResponse<DaffSearchCategoryResult>> {
    return this.apollo.query<MagentoSearchForCategoriesResponse>({
      query: categorySearch(),
      variables: {
        query,
        pageSize: options.limit,
      },
    }).pipe(
      map(result => result.data.categories.items.map(category => this.magentoCategoryTransformerService.transform(category, category.products.items))),
      map(searchResults => daffSearchTransformResultsToCollection(daffTransformCategoriesToSearchResults(searchResults))),
      map(collection => ({
        collection,
        metadata: {},
      })),
      catchError(err => throwError(() => transformSearchCategoryMagentoError(err))),
    );
  }
}
