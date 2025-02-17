import { Observable } from 'rxjs';

import { DaffCollectionFacadeInterface } from '@daffodil/core/state';
import { DaffProductReviews } from '@daffodil/reviews';

export interface DaffProductPageReviewsCollectionFacadeInterface extends DaffCollectionFacadeInterface<DaffProductReviews['metadata']> {
  appliedFilter$: Observable<DaffProductReviews['metadata']['appliedFilter']>;
}
