import { Injectable } from '@angular/core';
import * as faker from '@faker-js/faker/locale/en_US';

import { DaffModelFactory } from '@daffodil/core/testing';
import {
  MockProduct,
  DaffProductKindFactory,
} from '@daffodil/product/testing';
import { DaffReviewedProduct } from '@daffodil/reviews';

/**
 * Mocked {@link DaffReviewedProduct} object.
 */
export class MockReviewedProduct extends MockProduct implements DaffReviewedProduct {
  aggregateReview = faker.datatype.number({ min: 1, max: 100 });
  reviewCount = faker.datatype.number({ min: 1, max: 100 });
}

/**
 * Factory for creating {@link DaffReviewedProduct}s.
 * It will create a product of random kind with the additional review fields.
 */
@Injectable({
  providedIn: 'root',
})
export class DaffReviewedProductFactory extends DaffModelFactory<DaffReviewedProduct>{
  constructor(
    private productKindFactory: DaffProductKindFactory,
  ) {
    super(MockReviewedProduct);
  }

  create(partial: Partial<DaffReviewedProduct> = {}): DaffReviewedProduct {
    return {
      ...this.productKindFactory.create(partial),
      ...super.create(partial),
    };
  }
}
