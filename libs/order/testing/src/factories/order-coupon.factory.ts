import { Injectable } from '@angular/core';
import * as faker from '@faker-js/faker/locale/en_US';

import { DaffModelFactory } from '@daffodil/core/testing';
import { DaffOrderCoupon } from '@daffodil/order';

export class MockOrderCoupon implements DaffOrderCoupon {
  code = faker.random.alphaNumeric(10);
};


@Injectable({
  providedIn: 'root',
})
export class DaffOrderCouponFactory extends DaffModelFactory<DaffOrderCoupon>{
  constructor() {
    super(MockOrderCoupon);
  }
}
