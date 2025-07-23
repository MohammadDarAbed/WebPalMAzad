import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './Users.reducer';

export const selectUserFeature = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(
  selectUserFeature,
  (state) => state.users
);

export const selectUserLoading = createSelector(
  selectUserFeature,
  (state) => state.loading
);

export const selectUserError = createSelector(
  selectUserFeature,
  (state) => state.error
);
