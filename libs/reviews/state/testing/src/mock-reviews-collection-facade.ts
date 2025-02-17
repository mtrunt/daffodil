import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MockDaffCollectionFacade } from '@daffodil/core/state/testing';
import { DaffProductReviews } from '@daffodil/reviews';
import { DaffProductPageReviewsCollectionFacadeInterface } from '@daffodil/reviews/state';

/**
 * @inheritdoc
 */
@Injectable({ providedIn: 'root' })
export class MockDaffProductPageReviewsCollectionFacade extends MockDaffCollectionFacade implements DaffProductPageReviewsCollectionFacadeInterface {
  appliedFilter$ = new BehaviorSubject<DaffProductReviews['metadata']['appliedFilter']>(null);
  metadata$ = new BehaviorSubject<DaffProductReviews['metadata']>(null);
}
