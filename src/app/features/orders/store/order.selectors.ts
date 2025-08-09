import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from './order.reducer';

export const selectOrderFeature = createFeatureSelector<OrderState>('orders');

export const selectAllOrders = createSelector(
  selectOrderFeature,
  (state) => state.orders
);

export const selectOrderLoading = createSelector(
  selectOrderFeature,
  (state) => state.loading
);

export const selectOrderError = createSelector(
  selectOrderFeature,
  (state) => state.error
);

export const selectLastDeletedOrderId = createSelector(
  selectOrderFeature,
  (state) => state.lastDeletedOrderId
);

export const selectLastCreatedOrderId = createSelector(
  selectOrderFeature,
  (state) => state.lastCreatedOrder
);

export const selectLastUpdatedOrderId = createSelector(
  selectOrderFeature,
  (state) => state.lastUpdatedOrder
);
