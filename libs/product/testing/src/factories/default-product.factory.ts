import { Injectable } from '@angular/core';
import * as faker from '@faker-js/faker/locale/en_US';

import { DaffModelFactory } from '@daffodil/core/testing';
import {
  DaffProduct,
  DaffProductTypeEnum,
} from '@daffodil/product';

/**
 * Mocked DaffProduct object.
 */
export class MockProduct implements DaffProduct {
  private stubPrice = faker.datatype.number({ min: 1, max: 1500 });
  private stubDiscount = faker.datatype.number({ min: 0, max: this.stubPrice - 1 });

  type = DaffProductTypeEnum.Simple;
  id = faker.datatype.uuid();
  url = `/${faker.internet.domainWord()}.html`;
  canonicalUrl = faker.internet.url();
  price = this.stubPrice;
  in_stock = true;
  discount = {
	  amount: this.stubDiscount,
	  percent: Math.floor((this.stubDiscount/this.stubPrice) * 100),
  };
  images = [];
  thumbnail = null;
  name = faker.commerce.productName();
  brand = faker.company.companyName();
  description = 'Lorem ipsum dolor sit amet, accumsan ullamcorper ei eam. Sint appetere ocurreret no per, et cum lorem disputationi. Sit ut magna delenit, assum vidisse vocibus sed ut. In aperiri malorum accusamus sea, novum mediocritatem ius at. Duo agam probo honestatis ut. Nec regione splendide cu, unum graeco vivendum in duo.';
  short_description = 'Lorem ipsum dolor sit amet, accumsan ullamcorper ei eam. Sint appetere ocurreret no per, et cum lorem disputationi. Sit ut magna delenit, assum vidisse vocibus sed ut. In aperiri malorum accusamus sea, novum mediocritatem ius at. Duo agam probo honestatis ut.';
  meta_title = faker.commerce.productName();
  meta_description = 'Lorem ipsum dolor sit amet, accumsan ullamcorper ei eam. Sint appetere ocurreret no per, et cum lorem disputationi. Sit ut magna delenit, assum vidisse vocibus sed ut. In aperiri malorum accusamus sea, novum mediocritatem ius at. Duo agam probo honestatis ut. Nec regione splendide cu, unum graeco vivendum in duo.';
}

/**
 * Factory for creating simple `DaffProduct`s of no special kind.
 */
@Injectable({
  providedIn: 'root',
})
export class DaffDefaultProductFactory extends DaffModelFactory<DaffProduct> {
  constructor() {
    super(MockProduct);
  }
}
