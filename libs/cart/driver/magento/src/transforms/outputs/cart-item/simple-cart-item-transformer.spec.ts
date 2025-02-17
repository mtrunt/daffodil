import { TestBed } from '@angular/core/testing';

import { DaffCartItemInputType } from '@daffodil/cart';
import { MagentoCartItemFactory } from '@daffodil/cart/driver/magento/testing';
import { DaffCartItemFactory } from '@daffodil/cart/testing';
import { MagentoProductStockStatusEnum } from '@daffodil/product/driver/magento';

import { transformMagentoSimpleCartItem } from './simple-cart-item-transformer';

describe('Driver | Magento | Cart | Transformer | SimpleMagentoCartItem', () => {
  let daffCartItemFactory: DaffCartItemFactory;
  let magentoCartItemFactory: MagentoCartItemFactory;

  let mockDaffCartItem;
  let mockMagentoCartItem;

  beforeEach(() => {
    daffCartItemFactory = TestBed.inject(DaffCartItemFactory);
    magentoCartItemFactory = TestBed.inject(MagentoCartItemFactory);

    mockDaffCartItem = daffCartItemFactory.create();
    mockMagentoCartItem = magentoCartItemFactory.create();
  });

  describe('transformMagentoSimpleCartItem', () => {
    let transformedCartItem;
    let sku;
    let qty;
    let price;
    let url;
    let label;
    let stock_status;
    let discount0;

    beforeEach(() => {
      sku = 'sku';
      qty = 3;
      price = 3.34;
      url = 'url';
      label = 'label';
      stock_status = MagentoProductStockStatusEnum.InStock;
      discount0 = price - 1;

      mockMagentoCartItem.product.sku = sku;
      mockMagentoCartItem.product.url_key = url;
      mockMagentoCartItem.product.url_suffix = '.html';
      mockMagentoCartItem.quantity = qty;
      mockMagentoCartItem.prices.price.value = price;
      mockMagentoCartItem.product.thumbnail = {
        url,
        label,
      };
      mockMagentoCartItem.prices.discounts = [{
        amount: {
          value: discount0,
          currency: 'USD',
        },
        label: 'Discount',
      }];

      transformedCartItem = transformMagentoSimpleCartItem(mockMagentoCartItem);
    });

    it('should return an object with the correct values', () => {
      expect(transformedCartItem.type).toEqual(DaffCartItemInputType.Simple);
      expect(transformedCartItem.sku).toEqual(sku);
      expect(transformedCartItem.url).toEqual(`/${url}.html`);
      expect(transformedCartItem.qty).toEqual(qty);
      expect(transformedCartItem.price).toEqual(price);
      expect(transformedCartItem.in_stock).toEqual(true);
      expect(transformedCartItem.image.id).toEqual(label);
      expect(transformedCartItem.image.url).toEqual(url);
      expect(transformedCartItem.image.label).toEqual(label);
      expect(transformedCartItem.discounts[0].amount).toEqual(discount0);
    });

    describe('when the discounts are null', () => {
      beforeEach(() => {
        mockMagentoCartItem.prices.discounts = null;

        transformedCartItem = transformMagentoSimpleCartItem(mockMagentoCartItem);
      });

      it('should set discounts to an empty array and not crash', () => {
        expect(transformedCartItem.discounts).toEqual([]);
      });
    });
  });
});
