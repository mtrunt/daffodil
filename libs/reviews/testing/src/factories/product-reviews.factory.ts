import { Injectable } from '@angular/core';
import * as faker from '@faker-js/faker/locale/en_US';

import { daffIdentifiableArrayToDict } from '@daffodil/core';
import { DaffModelFactory } from '@daffodil/core/testing';
import {
  DaffProductReview,
  DaffProductReviews,
} from '@daffodil/reviews';

import { DaffProductReviewFactory } from './product-review.factory';
import { DaffProductReviewsMetadataFactory } from './product-reviews-metadata.factory';

/**
 * Mocked {@link DaffProductReviews} object.
 */
export class MockProductReviews implements DaffProductReviews {
  metadata: DaffProductReviews['metadata'];
  data: DaffProductReviews['data'];

  constructor(
    private reviewFactory: DaffProductReviewFactory,
    private metadataFactory: DaffProductReviewsMetadataFactory,
  ) {
    this.data = this.createReviews();

    const reviews = Object.values(this.data);
    this.metadata = this.metadataFactory.create({
      count: reviews.length,
      ids: reviews.map(({ id }) => id),
    });
  }

  private createReviews(): Record<DaffProductReview['id'], DaffProductReview> {
    return daffIdentifiableArrayToDict(this.reviewFactory.createMany(faker.datatype.number({ min: 3, max: 15 })));
  }
}

/**
 * Factory for creating DaffProductReviewss.
 */
@Injectable({
  providedIn: 'root',
})
export class DaffProductReviewsFactory extends DaffModelFactory<DaffProductReviews>{
  constructor(
    reviewFactory: DaffProductReviewFactory,
    metadataFactory: DaffProductReviewsMetadataFactory,
  ) {
    super(MockProductReviews, reviewFactory, metadataFactory);
  }
}
