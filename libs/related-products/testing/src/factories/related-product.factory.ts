import { Injectable } from '@angular/core';
import * as faker from '@faker-js/faker/locale/en_US';

import { DaffModelFactory } from '@daffodil/core/testing';
import { DaffProduct } from '@daffodil/product';
import {
  MockProduct,
  DaffProductKindFactory,
} from '@daffodil/product/testing';
import { DaffRelatedProduct } from '@daffodil/related-products';

/**
 * Mocked DaffRelatedProduct object.
 */
export class MockRelatedProduct extends MockProduct implements DaffRelatedProduct {
  related: DaffProduct[] = [];

  constructor(
    productFactory: DaffProductKindFactory,
  ) {
    super();

    this.related = productFactory.createMany(3);
  }
}

/**
 * Factory for creating DaffRelatedProducts.
 */
@Injectable({
  providedIn: 'root',
})
export class DaffRelatedProductFactory extends DaffModelFactory<DaffRelatedProduct>{
  constructor(
    productKindFactory: DaffProductKindFactory,
  ) {
    super(MockRelatedProduct, productKindFactory);
  }
}
