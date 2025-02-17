import {
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { Observable } from 'rxjs';

import {
  DaffCategoryIdRequest,
  DaffCategory,
  DaffGetCategoryResponse,
  DaffCategoryRequestKind,
  DaffCategoryUrlRequest,
} from '@daffodil/category';
import {
  MagentoGetACategoryResponse,
  MagentoCategory,
  MagentoGetCategoryQuery,
  MagentoGetProductsResponse,
  MagentoGetProductsQuery,
} from '@daffodil/category/driver/magento';
import { DaffCategoryDriverMagentoCategoryFactory } from '@daffodil/category/driver/magento/testing';
import {
  DaffCategoryFactory,
  DaffCategoryPageMetadataFactory,
} from '@daffodil/category/testing';
import {
  DaffProductFilterEqualRequest,
  DaffProductFilterRangeNumericRequest,
  DaffProductFilterRangeRequestOption,
  daffProductComputeFilterRangePairLabel,
} from '@daffodil/product';
import {
  MagentoAggregation,
  MagentoProduct,
  MagentoProductFilterTypeField,
  MagentoProductGetFilterTypes,
  MagentoProductGetFilterTypesResponse,
  MagentoProductPageInfo,
  MagentoProductSortFields,
} from '@daffodil/product/driver/magento';
import {
  MagentoProductFilterTypeFieldFactory,
  MagentoProductAggregationPriceFactory,
  MagentoProductAggregationSelectFactory,
  MagentoProductSortFieldsFactory,
  MagentoProductPageInfoFactory,
  MagentoSimpleProductFactory,
} from '@daffodil/product/driver/magento/testing';
import {
  DaffProductFactory,
  DaffProductFilterRangeNumericRequestOptionFactory,
  DaffProductFilterRequestEqualFactory,
  DaffProductFilterRequestRangeNumericFactory,
} from '@daffodil/product/testing';

import { DaffMagentoCategoryService } from './category.service';

describe('@daffodil/category/driver/magento | DaffMagentoCategoryService', () => {
  let categoryService: DaffMagentoCategoryService;
  let categoryFactory: DaffCategoryFactory;
  let categoryPageMetadataFactory: DaffCategoryPageMetadataFactory;
  let controller: ApolloTestingController;
  let productFactory: DaffProductFactory;
  let equalFilterRequestFactory: DaffProductFilterRequestEqualFactory;
  let rangeFilterRequestFactory: DaffProductFilterRequestRangeNumericFactory;
  let rangeFilterRequestOptionFactory: DaffProductFilterRangeNumericRequestOptionFactory;
  let magentoCategoryFactory: DaffCategoryDriverMagentoCategoryFactory;
  let magentoSortFieldsFactory: MagentoProductSortFieldsFactory;
  let priceAggregateFactory: MagentoProductAggregationPriceFactory;
  let selectAggregateFactory: MagentoProductAggregationSelectFactory;
  let magentoFilterTypeFieldFactory: MagentoProductFilterTypeFieldFactory;
  let magentoProductFactory: MagentoSimpleProductFactory;
  let magentoPageInfoFactory: MagentoProductPageInfoFactory;

  let mockCategoryRequest: DaffCategoryIdRequest;
  let mockCategory: DaffCategory;
  let equalFilterRequest: DaffProductFilterEqualRequest;
  let rangeFilterRequest: DaffProductFilterRangeNumericRequest;
  let rangeFilterRequestOption: DaffProductFilterRangeRequestOption<number>;
  let rangeFilterRequestOptionLabel: string;
  let mockMagentoCategory: MagentoCategory;
  let mockMagentoProductSortFields: MagentoProductSortFields;
  let mockMagentoSelectAggregation: MagentoAggregation;
  let mockMagentoPriceAggregation: MagentoAggregation;
  let mockMagentoSelectFilterTypeField: MagentoProductFilterTypeField;
  let mockMagentoPriceFilterTypeField: MagentoProductFilterTypeField;
  let mockMagentoProduct: MagentoProduct;
  let mockMagentoProductPageInfo: MagentoProductPageInfo;
  let mockGetCategoryResponse: MagentoGetACategoryResponse;
  let mockGetFilterTypesResponse: MagentoProductGetFilterTypesResponse;
  let mockGetProductsResponse: MagentoGetProductsResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
      ],
      providers: [
        DaffMagentoCategoryService,
      ],
    });

    categoryService = TestBed.inject(DaffMagentoCategoryService);
    controller = TestBed.inject(ApolloTestingController);

    categoryFactory = TestBed.inject(DaffCategoryFactory);
    categoryPageMetadataFactory = TestBed.inject(DaffCategoryPageMetadataFactory);
    productFactory = TestBed.inject(DaffProductFactory);
    equalFilterRequestFactory = TestBed.inject(DaffProductFilterRequestEqualFactory);
    rangeFilterRequestFactory = TestBed.inject(DaffProductFilterRequestRangeNumericFactory);
    rangeFilterRequestOptionFactory = TestBed.inject(DaffProductFilterRangeNumericRequestOptionFactory);
    magentoCategoryFactory = TestBed.inject(DaffCategoryDriverMagentoCategoryFactory);
    magentoSortFieldsFactory = TestBed.inject(MagentoProductSortFieldsFactory);
    selectAggregateFactory = TestBed.inject(MagentoProductAggregationSelectFactory);
    priceAggregateFactory = TestBed.inject(MagentoProductAggregationPriceFactory);
    rangeFilterRequestOptionFactory = TestBed.inject(DaffProductFilterRangeNumericRequestOptionFactory);
    magentoProductFactory = TestBed.inject(MagentoSimpleProductFactory);
    magentoPageInfoFactory = TestBed.inject(MagentoProductPageInfoFactory);
    magentoFilterTypeFieldFactory = TestBed.inject(MagentoProductFilterTypeFieldFactory);

    mockCategory = categoryFactory.create();
    mockCategoryRequest = {
      kind: DaffCategoryRequestKind.ID,
      id: mockCategory.id,
    };
    mockMagentoProduct = magentoProductFactory.create();
    mockMagentoCategory = magentoCategoryFactory.create({
      uid: mockCategory.id,
      products: {
        items: [
          mockMagentoProduct,
        ],
      },
    });
    mockMagentoProductSortFields = magentoSortFieldsFactory.create();
    mockMagentoPriceAggregation = priceAggregateFactory.create();
    mockMagentoSelectAggregation = selectAggregateFactory.create();
    mockMagentoSelectFilterTypeField = magentoFilterTypeFieldFactory.create({
      name: mockMagentoSelectAggregation.attribute_code,
      type: {
        name: mockMagentoSelectAggregation.type,
      },
    });
    mockMagentoPriceFilterTypeField = magentoFilterTypeFieldFactory.create({
      name: mockMagentoPriceAggregation.attribute_code,
      type: {
        name: mockMagentoPriceAggregation.type,
      },
    });
    mockMagentoProductPageInfo = magentoPageInfoFactory.create();

    // transformedCategory = categoryFactory.create();
    // transformedCategoryPageMetadata =  categoryPageMetadataFactory.create();
    // transformedProducts =  productFactory.createMany(3);

    mockGetCategoryResponse = {
      categoryList: [
        mockMagentoCategory,
      ],
    };
    mockGetFilterTypesResponse = {
      __type: {
        inputFields: [
          mockMagentoPriceFilterTypeField,
          mockMagentoSelectFilterTypeField,
        ],
      },
    };
    mockGetProductsResponse = {
      products: {
        // items: [
        //   mockMagentoProduct,
        // ],
        // TODO: fixme
        items: [],
        total_count: 1,
        page_info: mockMagentoProductPageInfo,
        aggregations: [
          mockMagentoPriceAggregation,
          mockMagentoSelectAggregation,
        ],
        sort_fields: mockMagentoProductSortFields,
      },
    };
  });

  it('should be created', () => {
    expect(categoryService).toBeTruthy();
  });

  describe('get | getting a category by ID', () => {
    let result: Observable<DaffGetCategoryResponse>;

    beforeEach(() => {
      result = categoryService.get(mockCategoryRequest);
    });

    it('should return a category with the correct info', done => {
      result.subscribe(res => {
        expect(res.category.id).toEqual(mockMagentoCategory.uid);
        expect(res.category.name).toEqual(mockMagentoCategory.name);
        done();
      });

      const categoryOp = controller.expectOne(MagentoGetCategoryQuery);
      const filterTypesOp = controller.expectOne(MagentoProductGetFilterTypes);
      const productsOp = controller.expectOne(MagentoGetProductsQuery());

      categoryOp.flushData(mockGetCategoryResponse);
      filterTypesOp.flushData(mockGetFilterTypesResponse);
      productsOp.flushData(mockGetProductsResponse);
    });

    describe('when filters are requested', () => {
      beforeEach(() => {
        equalFilterRequest = equalFilterRequestFactory.create({
          name: mockMagentoSelectFilterTypeField.name,
          value: mockMagentoSelectAggregation.options.map(agg => agg.value),
        });
        rangeFilterRequestOption = rangeFilterRequestOptionFactory.create();
        rangeFilterRequest = rangeFilterRequestFactory.create({
          name: mockMagentoPriceFilterTypeField.name,
          value: rangeFilterRequestOption,
        });
        rangeFilterRequestOptionLabel = daffProductComputeFilterRangePairLabel(rangeFilterRequestOption.min, rangeFilterRequestOption.max);
        mockCategoryRequest = {
          ...mockCategoryRequest,
          kind: DaffCategoryRequestKind.ID,
          filterRequests: [
            equalFilterRequest,
            rangeFilterRequest,
          ],
        };

        result = categoryService.get(mockCategoryRequest);
      });

      it('should apply those filters', done => {
        result.subscribe(res => {
          equalFilterRequest.value.forEach(option => {
            expect(res.categoryPageMetadata.filters[equalFilterRequest.name].options[option].applied).toBeTrue();
          });
          expect(res.categoryPageMetadata.filters[rangeFilterRequest.name].options[rangeFilterRequestOptionLabel].applied).toBeTrue();
          done();
        });

        const categoryOp = controller.expectOne(MagentoGetCategoryQuery);
        const filterTypesOp = controller.expectOne(MagentoProductGetFilterTypes);
        const productsOp = controller.expectOne(MagentoGetProductsQuery());

        categoryOp.flushData(mockGetCategoryResponse);
        filterTypesOp.flushData(mockGetFilterTypesResponse);
        productsOp.flushData(mockGetProductsResponse);
      });
    });
  });

  describe('getByUrl | getting a category by URL', () => {
    let mockCategoryUrlRequest: DaffCategoryUrlRequest;
    let url: string;
    let result: Observable<DaffGetCategoryResponse>;

    beforeEach(() => {
      url = '/test/url?with=query#fragment';
      mockCategoryUrlRequest = {
        kind: DaffCategoryRequestKind.URL,
        url,
      };
      result = categoryService.getByUrl(mockCategoryUrlRequest);
    });

    it('should return a category with the correct info', fakeAsync(() => {
      result.subscribe(res => {
        expect(res.category.id).toEqual(mockMagentoCategory.uid);
        expect(res.category.name).toEqual(mockMagentoCategory.name);
        flush();
      });

      const categoryOp = controller.expectOne(MagentoGetCategoryQuery);
      const filterTypesOp = controller.expectOne(MagentoProductGetFilterTypes);

      categoryOp.flushData(mockGetCategoryResponse);
      filterTypesOp.flushData(mockGetFilterTypesResponse);

      tick();

      const productsOp = controller.expectOne(MagentoGetProductsQuery());
      productsOp.flushData(mockGetProductsResponse);
    }));

    it('should query the category with the truncated URL', fakeAsync(() => {
      result.subscribe();

      const categoryOp = controller.expectOne(MagentoGetCategoryQuery);
      const filterTypesOp = controller.expectOne(MagentoProductGetFilterTypes);

      categoryOp.flushData(mockGetCategoryResponse);
      filterTypesOp.flushData(mockGetFilterTypesResponse);

      tick();

      const productsOp = controller.expectOne(MagentoGetProductsQuery());
      productsOp.flushData(mockGetProductsResponse);

      expect(categoryOp.operation.variables.filters.url_path.eq).toEqual('test/url');

      flush();
    }));

    it('should query the products with the category ID', fakeAsync(() => {
      result.subscribe();

      const categoryOp = controller.expectOne(MagentoGetCategoryQuery);
      const filterTypesOp = controller.expectOne(MagentoProductGetFilterTypes);

      categoryOp.flushData(mockGetCategoryResponse);
      filterTypesOp.flushData(mockGetFilterTypesResponse);

      tick();

      const productsOp = controller.expectOne(MagentoGetProductsQuery());
      productsOp.flushData(mockGetProductsResponse);

      expect(productsOp.operation.variables.filter.category_uid.eq).toEqual(mockMagentoCategory.uid);

      flush();
    }));

    describe('when the request applied a filter', () => {
      beforeEach(() => {
        equalFilterRequest = equalFilterRequestFactory.create({
          name: mockMagentoSelectFilterTypeField.name,
          value: mockMagentoSelectAggregation.options.map(agg => agg.value),
        });
        rangeFilterRequestOption = rangeFilterRequestOptionFactory.create();
        rangeFilterRequest = rangeFilterRequestFactory.create({
          name: mockMagentoPriceFilterTypeField.name,
          value: rangeFilterRequestOption,
        });
        rangeFilterRequestOptionLabel = daffProductComputeFilterRangePairLabel(rangeFilterRequestOption.min, rangeFilterRequestOption.max);
        mockCategoryUrlRequest = {
          ...mockCategoryUrlRequest,
          filterRequests: [
            equalFilterRequest,
            rangeFilterRequest,
          ],
        };

        result = categoryService.getByUrl(mockCategoryUrlRequest);
      });

      it('should apply those filters in the response', fakeAsync(() => {
        result.subscribe(res => {
          equalFilterRequest.value.forEach(option => {
            expect(res.categoryPageMetadata.filters[equalFilterRequest.name].options[option].applied).toBeTrue();
          });
          expect(res.categoryPageMetadata.filters[rangeFilterRequest.name].options[rangeFilterRequestOptionLabel].applied).toBeTrue();
          flush();
        });

        const categoryOp = controller.expectOne(MagentoGetCategoryQuery);
        const filterTypesOp = controller.expectOne(MagentoProductGetFilterTypes);

        categoryOp.flushData(mockGetCategoryResponse);
        filterTypesOp.flushData(mockGetFilterTypesResponse);

        tick();

        const productsOp = controller.expectOne(MagentoGetProductsQuery());
        productsOp.flushData(mockGetProductsResponse);
      }));
    });
  });

  afterEach(() => {
    controller.verify();
  });
});
