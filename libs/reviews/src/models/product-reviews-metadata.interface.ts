import { DaffCollectionMetadata } from '@daffodil/core';

/**
 * Represents metadata about a collection of product reviews.
 */
export interface DaffProductReviewsMetadata extends DaffCollectionMetadata {
  /**
   * The applied rating filter.
   */
  appliedFilter: number;
};
