import { DaffCartItem } from '@daffodil/cart';
import { DaffStateError } from '@daffodil/core/state';

/**
 * The state of the cart item is intended to enhance the client side UX like indicating when a cart
 * item was recently added/updated. For states that indicate the completion of some process, the state is given
 * a decay time based on the DaffCartItemStateDebounceTime injection token. For example when a cart item is
 * added to the cart, the state of that item will be "New" for a designated time then will revert to the default state.
 */
export interface DaffStatefulCartItem extends DaffCartItem {
  daffState: DaffCartItemStateEnum;
  /**
   * Errors specific to the cart item.
   */
  errors: DaffStateError[];
}

export enum DaffCartItemStateEnum {
  New = 'new',
  Updated = 'updated',
  Mutating = 'mutating',
  Error = 'error',
  Default = 'default'
}
