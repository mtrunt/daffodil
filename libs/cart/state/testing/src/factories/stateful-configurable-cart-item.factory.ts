import { Injectable } from '@angular/core';
import * as faker from '@faker-js/faker/locale/en_US';

import {
  DaffCartItemStateEnum,
  DaffStatefulConfigurableCartItem,
} from '@daffodil/cart/state';
import { DaffMockConfigurableCartItem } from '@daffodil/cart/testing';
import { DaffModelFactory } from '@daffodil/core/testing';

export class DaffMockStatefulConfigurableCartItem extends DaffMockConfigurableCartItem implements DaffStatefulConfigurableCartItem {
  daffState: DaffCartItemStateEnum.Default;
  errors = [];
}

@Injectable({
  providedIn: 'root',
})
export class DaffStatefulConfigurableCartItemFactory extends DaffModelFactory<DaffStatefulConfigurableCartItem> {

  constructor(){
    super(DaffMockStatefulConfigurableCartItem);
  }
}
