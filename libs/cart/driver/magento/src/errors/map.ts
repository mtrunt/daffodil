import {
  DaffCartNotFoundError,
  DaffCartDriverErrorCodes,
} from '@daffodil/cart/driver';
import { DaffErrorCodeMap } from '@daffodil/core';
import { DaffBadInputError } from '@daffodil/driver';

import { MagentoCartGraphQlErrorCode } from './codes';

export const DaffCartMagentoErrorMap: DaffErrorCodeMap = {
  [MagentoCartGraphQlErrorCode.CART_NOT_FOUND]: DaffCartNotFoundError,
  [MagentoCartGraphQlErrorCode.BAD_INPUT]: DaffBadInputError,
};

export const DaffCartMagentoErrorMessageRegexMap = {
  [DaffCartDriverErrorCodes.INVALID_COUPON_CODE]: /The coupon code isn\'t valid/,
  [DaffCartDriverErrorCodes.PRODUCT_OUT_OF_STOCK]: /(The requested qty is not available)|(This product is out of stock)|(Some of the products are out of stock)|(There are no source items with the in stock status)/,
  [DaffCartDriverErrorCodes.ITEM_EXCEEDS_MAX_QTY]: /The requested qty exceeds the maximum qty allowed in shopping cart/,
  [DaffCartDriverErrorCodes.INVALID_EMAIL]: /Invalid email format/,
};
