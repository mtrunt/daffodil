import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import {
  Observable,
  of,
} from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { DaffSortDirectionEnum } from '@daffodil/core';
import {
  DaffCollectionChangePageSize,
  DaffCollectionChangeCurrentPage,
  DaffCollectionChangeSortingOption,
} from '@daffodil/core/state';
import {
  DaffProductCollectionRequest,
  DaffProductCollection,
  daffProductFilterArrayToDict,
  DaffProductFilterRequest,
  daffProductFiltersToRequests,
  DaffProductFilterToggleRequest,
} from '@daffodil/product';
import { DaffProductGetQueryParamsFromRequest } from '@daffodil/product/routing';
import {
  DaffProductCollectionApplyFilters,
  DaffProductCollectionClearFilters,
  DaffProductCollectionRemoveFilters,
  DaffProductCollectionReplaceFilters,
  DaffProductCollectionToggleFilter,
} from '@daffodil/product/state';
import {
  DaffProductStateTestingModule,
  MockDaffProductCollectionFacade,
} from '@daffodil/product/state/testing';
import {
  DaffProductCollectionMetadataFactory,
  DaffProductFilterFactory,
  DaffProductFilterRequestFactory,
  DaffProductFilterToggleRequestFactory,
} from '@daffodil/product/testing';

import { DaffProductRoutingCollectionEffects } from './collection.effects';

enum TestProductCollectionActionTypes {
  TestProductReplaceFiltersAction = 'Test Product Replace Filters Action',
  TestProductApplyFiltersAction = 'Test Product Apply Filters Action',
  TestProductRemoveFiltersAction = 'Test Product Remove Filters Action',
  TestProductClearFiltersAction = 'Test Product Clear Filters Action',
  TestProductToggleFiltersAction = 'Test Product Toggle Filters Action',
  TestProductChangePageSizeAction = 'Test Product Change Page Size Action',
  TestProductChangeCurrentPageAction = 'Test Product Change Current Page Action',
  TestProductChangeSortingOptionAction = 'Test Product Change Sorting Option Action',
  TestProductSuccessAction = 'Test Product Success Action',
  TestProductFailureAction = 'Test Product Failure Action',
  TestProductLoadAction = 'Test Product Load Action',
}

const daffTestProductCollectionActionTypes = [
  TestProductCollectionActionTypes.TestProductReplaceFiltersAction,
  TestProductCollectionActionTypes.TestProductApplyFiltersAction,
  TestProductCollectionActionTypes.TestProductRemoveFiltersAction,
  TestProductCollectionActionTypes.TestProductClearFiltersAction,
  TestProductCollectionActionTypes.TestProductToggleFiltersAction,
  TestProductCollectionActionTypes.TestProductChangePageSizeAction,
  TestProductCollectionActionTypes.TestProductChangeCurrentPageAction,
  TestProductCollectionActionTypes.TestProductChangeSortingOptionAction,
  TestProductCollectionActionTypes.TestProductSuccessAction,
  TestProductCollectionActionTypes.TestProductFailureAction,
  TestProductCollectionActionTypes.TestProductLoadAction,
];

class TestProductSuccess implements Action {
  public type = TestProductCollectionActionTypes.TestProductSuccessAction;

  constructor(public response: DaffProductCollection) {}
}

@Injectable()
class TestEffects extends DaffProductRoutingCollectionEffects {
  constructor(
    actions$: Actions,
    router: Router,
    collectionFacade: MockDaffProductCollectionFacade,
    getQueryParams: DaffProductGetQueryParamsFromRequest,
    route: ActivatedRoute,
  ) {
    super(
      actions$,
      router,
      daffTestProductCollectionActionTypes,
      collectionFacade,
      getQueryParams,
      route,
    );
  }
}

describe('@daffodil/product/routing | DaffProductRoutingCollectionEffects', () => {
  let actions$: Observable<any>;
  let effects: TestEffects;
  let facade: MockDaffProductCollectionFacade;

  let productCollectionMetadataFactory: DaffProductCollectionMetadataFactory;
  let filterFactory: DaffProductFilterFactory;
  let filterRequestFactory: DaffProductFilterRequestFactory;
  let filterToggleRequestFactory: DaffProductFilterToggleRequestFactory;
  let getQueryParamsSpy: jasmine.SpyObj<DaffProductGetQueryParamsFromRequest>;

  const testDriverSuccess = (cb: () => Action) => {
    it('should set the query params to the product collection request', fakeAsync(() => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });

      const stubProductCollectionMetadata = productCollectionMetadataFactory.create({
        filters: daffProductFilterArrayToDict(filterFactory.createMany(3)),
      });
      const request: DaffProductCollectionRequest = {
        appliedSortOption: stubProductCollectionMetadata.appliedSortOption,
        appliedSortDirection: stubProductCollectionMetadata.appliedSortDirection,
        currentPage: stubProductCollectionMetadata.currentPage,
        pageSize: stubProductCollectionMetadata.pageSize,
        filterRequests: daffProductFiltersToRequests(stubProductCollectionMetadata.filters),
      };

      getQueryParamsSpy.getQueryParams.and.returnValue(request);

      facade.metadata$.next(stubProductCollectionMetadata);

      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('--a', { a: cb() });

        const expectedMarble = '---';

        expectObservable(effects.update$).toBe(expectedMarble);
      });

      tick();

      expect(TestBed.inject(ActivatedRoute).snapshot.queryParams).toEqual(jasmine.objectContaining({
        ...request,
        currentPage: String(request.currentPage),
        pageSize: String(request.pageSize),
      }));
    }));
  };

  beforeEach(() => {
    getQueryParamsSpy = jasmine.createSpyObj<DaffProductGetQueryParamsFromRequest>(['getQueryParams']);

    TestBed.configureTestingModule({
      imports: [
        DaffProductStateTestingModule,
        RouterTestingModule,
      ],
      providers: [
        TestEffects,
        provideMockActions(() => actions$),
        {
          provide: DaffProductGetQueryParamsFromRequest,
          useValue: getQueryParamsSpy,
        },
      ],
    });

    facade = TestBed.inject(MockDaffProductCollectionFacade);
    effects = TestBed.inject(TestEffects);

    productCollectionMetadataFactory = TestBed.inject(DaffProductCollectionMetadataFactory);
    filterFactory = TestBed.inject(DaffProductFilterFactory);
    filterRequestFactory = TestBed.inject(DaffProductFilterRequestFactory);
    filterToggleRequestFactory = TestBed.inject(DaffProductFilterToggleRequestFactory);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('when replaceFilters is triggered', () => {
    let filterRequest: DaffProductFilterRequest;
    let action: DaffProductCollectionReplaceFilters;

    beforeEach(() => {
      filterRequest = filterRequestFactory.create();
      action = {
        type: TestProductCollectionActionTypes.TestProductReplaceFiltersAction,
        filters: [filterRequest],
      };
    });

    testDriverSuccess(() => action);
  });

  describe('when applyFilters is triggered', () => {
    let filterRequest: DaffProductFilterRequest;
    let action: DaffProductCollectionApplyFilters;


    beforeEach(() => {
      filterRequest = filterRequestFactory.create();
      action = {
        type: TestProductCollectionActionTypes.TestProductReplaceFiltersAction,
        filters: [filterRequest],
      };
    });

    testDriverSuccess(() => action);
  });

  describe('when clearFilters is triggered', () => {
    let action: DaffProductCollectionClearFilters;


    beforeEach(() => {
      action = {
        type: TestProductCollectionActionTypes.TestProductClearFiltersAction,
      };
    });

    testDriverSuccess(() => action);
  });

  describe('when removeFilters is triggered', () => {
    let filterRequest: DaffProductFilterRequest;
    let action: DaffProductCollectionRemoveFilters;


    beforeEach(() => {
      filterRequest = filterRequestFactory.create();
      action = {
        type: TestProductCollectionActionTypes.TestProductRemoveFiltersAction,
        filters: [filterRequest],
      };;
    });

    testDriverSuccess(() => action);
  });

  describe('when toggleFilter is triggered', () => {
    let toggleRequest: DaffProductFilterToggleRequest;
    let action: DaffProductCollectionToggleFilter;

    beforeEach(() => {
      toggleRequest = filterToggleRequestFactory.create();
      action = {
        type: TestProductCollectionActionTypes.TestProductReplaceFiltersAction,
        filter: toggleRequest,
      };
    });

    testDriverSuccess(() => action);
  });

  describe('when changePageSize is triggered', () => {
    let toggleRequest: DaffProductFilterToggleRequest;
    let action: DaffCollectionChangePageSize;

    beforeEach(() => {
      toggleRequest = filterToggleRequestFactory.create();
      action = {
        type: TestProductCollectionActionTypes.TestProductReplaceFiltersAction,
        pageSize: 5,
      };
    });

    testDriverSuccess(() => action);
  });

  describe('when changeCurrentPage is triggered', () => {
    let toggleRequest: DaffProductFilterToggleRequest;
    let action: DaffCollectionChangeCurrentPage;

    beforeEach(() => {
      toggleRequest = filterToggleRequestFactory.create();
      action = {
        type: TestProductCollectionActionTypes.TestProductReplaceFiltersAction,
        currentPage: 5,
      };
    });

    testDriverSuccess(() => action);
  });

  describe('when changeSorting is triggered', () => {
    let toggleRequest: DaffProductFilterToggleRequest;
    let action: DaffCollectionChangeSortingOption;

    beforeEach(() => {
      toggleRequest = filterToggleRequestFactory.create();
      action = {
        type: TestProductCollectionActionTypes.TestProductReplaceFiltersAction,
        sort: {
          option: 'option',
          direction: DaffSortDirectionEnum.Ascending,
        },
      };
    });

    testDriverSuccess(() => action);
  });
});
