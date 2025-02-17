import { TestBed } from '@angular/core/testing';

import { MagentoProduct } from '@daffodil/product/driver/magento';

import { MagentoCoreProductFactory } from './product.factory';

describe('@daffodil/product/testing | MagentoCoreProductFactory', () => {
  let factory: MagentoCoreProductFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MagentoCoreProductFactory],
    });

    factory = TestBed.inject(MagentoCoreProductFactory);
  });

  it('should be created', () => {
    expect(factory).toBeTruthy();
  });

  describe('create', () => {
    let result: MagentoProduct;

    beforeEach(() => {
      result = factory.create();
    });

    it('should return a MagentoProduct with all required fields defined', () => {
      expect(result.__typename).toBeDefined();
      expect(result.uid).toBeDefined();
      expect(result.image.label).toBeDefined();
      expect(result.image.url).toBeDefined();
      expect(result.thumbnail.label).toBeDefined();
      expect(result.thumbnail.url).toBeDefined();
      expect(result.url_key).toBeDefined();
      expect(result.url_suffix).toBeDefined();
      expect(result.canonical_url).toBeDefined();
      expect(result.name).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.short_description).toBeDefined();
      expect(result.media_gallery_entries).toBeDefined();
      expect(result.sku).toBeDefined();
      expect(result.stock_status).toBeDefined();
      expect(result.price_range.maximum_price.regular_price).toBeDefined();
      expect(result.price_range.maximum_price.discount).toBeDefined();
    });
  });
});
