import { TestBed } from '@angular/core/testing';

import { DaffSortDirectionEnum } from '@daffodil/core';
import {
  DaffProductReviewsCollectionRequest,
  DaffProductReviewsMetadata,
} from '@daffodil/reviews';
import { daffReviewsCollectionReducerInitialState as initialState } from '@daffodil/reviews/state';
import { DaffProductReviewsMetadataFactory } from '@daffodil/reviews/testing';

import {
  daffGetReviewsCollectionStateAdapter,
  DaffReviewsCollectionStateAdapter,
} from './adapter';

describe('@daffodil/core/state | daffGetReviewsCollectionStateAdapter', () => {
  let adapter: DaffReviewsCollectionStateAdapter;
  let collectionMetadataFactory: DaffProductReviewsMetadataFactory;

  let collectionMetadata: DaffProductReviewsMetadata;

  beforeEach(() => {
    adapter = daffGetReviewsCollectionStateAdapter();

    collectionMetadataFactory = TestBed.inject(DaffProductReviewsMetadataFactory);

    collectionMetadata = collectionMetadataFactory.create();
  });

  describe('storeRequest', () => {
    let result: DaffProductReviewsMetadata;
    let collectionRequest: DaffProductReviewsCollectionRequest;

    beforeEach(() => {
      collectionRequest = {
        appliedFilter: collectionMetadata.appliedFilter,
      };

      result = adapter.storeRequest(collectionRequest, initialState);
    });

    it('sets the included parameters on collectionMetadata from the request', () => {
      expect(result.appliedFilter).toEqual(collectionRequest.appliedFilter);
    });
  });

  describe('setMetadata', () => {
    let result: DaffProductReviewsMetadata;

    beforeEach(() => {
      result = adapter.setMetadata(collectionMetadata, initialState);
    });

    it('sets filter', () => {
      expect(result.appliedFilter).toEqual(collectionMetadata.appliedFilter);
    });
  });

  describe('setFilter', () => {
    let result: DaffProductReviewsMetadata;
    let filter: number;

    beforeEach(() => {
      filter = 5;
      result = adapter.setFilter(filter, initialState);
    });

    it('sets filter', () => {
      expect(result.appliedFilter).toEqual(filter);
    });

    it('resets currentPage', () => {
      expect(result.currentPage).toEqual(1);
    });
  });
});
