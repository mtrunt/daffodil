import { Injectable } from '@angular/core';
import * as faker from '@faker-js/faker/locale/en_US';

import {
  MagentoCartItemTypeEnum,
  MagentoConfigurableCartItem,
} from '@daffodil/cart/driver/magento';
import { DaffModelFactory } from '@daffodil/core/testing';

import { MockMagentoCartItem } from './cart-item.factory';

export class MockMagentoConfigurableCartItem extends MockMagentoCartItem implements MagentoConfigurableCartItem {
  __typename = MagentoCartItemTypeEnum.Configurable;
  configurable_options = [
    {
      option_label: 'Color',
      value_label: 'Red',
    },
    {
      option_label: 'Size',
      value_label: 'M',
    },
  ];
}

@Injectable({
  providedIn: 'root',
})
export class MagentoConfigurableCartItemFactory extends DaffModelFactory<MagentoConfigurableCartItem> {

  constructor(){
    super(MockMagentoConfigurableCartItem);
  }
}
