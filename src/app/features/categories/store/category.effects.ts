import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as CategoryActions from './category.actions';
import * as NotificationActions from '../../../shared/notifications/store/notification.actions';
import { NotificationModel, NotificationType } from '../../../shared/notifications/snackbar.model';
import { ErrorsModel } from '../../../shared/models/errors.model';
import { CategoryService } from '../services/category.service';
import { Category } from '../Models/category.model';

@Injectable()
export class CategoryEffects {
  loadCategories$;
  loadCategoryById$;
  createCategory$;
  updateCategory$;
  deleteCategory$;
  createCategorySuccess$;
  createCategoryFailure$;
  updateCategorySuccess$;
  deleteCategorySuccess$;
  deleteCategoryFailure$;
  updateCategoryFailure$;

  constructor(
    private readonly actions$: Actions,
    private readonly categoryService: CategoryService
  ) {
    this.loadCategories$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoryActions.loadCategories),
        mergeMap(() =>
          this.categoryService.getCategories().pipe(
            map(categories => CategoryActions.loadCategoriesSuccess({ categories })),
            catchError((error: ErrorsModel<Category>) =>
              of(CategoryActions.loadCategoriesFailure({ error }))
            )
          )
        )
      )
    );

    this.loadCategoryById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoryActions.loadCategoryById),
        mergeMap(({ id }) =>
          this.categoryService.getCategoryById(id).pipe(
            map(category => CategoryActions.loadCategoryByIdSuccess({ category })),
            catchError(error =>
              of(CategoryActions.loadCategoriesFailure({ error }))
            )
          )
        )
      )
    );

    this.createCategory$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoryActions.createCategory),
        mergeMap((action) =>
          this.categoryService.createCategory(action.category).pipe(
            map(() => CategoryActions.createCategorySuccess({ category: action.category })),
            catchError((error: ErrorsModel<Category>) =>
              of(CategoryActions.createCategoryFailure({ error }))
            )
          )
        )
      )
    );

    this.createCategoryFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoryActions.createCategoryFailure),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            // text: action.error,
            text: 'Error!',
            type: NotificationType.Error,
            autoDisappear: false,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.createCategorySuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoryActions.createCategorySuccess),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            text: `Category created successfully: ${action.category.name}`,
            type: NotificationType.Information,
            autoDisappear: true,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.updateCategory$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoryActions.updateCategory),
        mergeMap((action) =>
          this.categoryService.updateCategory(action.category).pipe(
            map(category => CategoryActions.updateCategorySuccess({ category })),
            catchError((error: ErrorsModel<Category>) =>
              of(CategoryActions.updateCategoryFailure({ error }))
            )
          )
        )
      )
    );

    this.updateCategorySuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoryActions.updateCategorySuccess),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            text: `Category updated successfully: ${action.category.name}`,
            type: NotificationType.Information,
            autoDisappear: true,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.updateCategoryFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoryActions.updateCategoryFailure),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            // text: action.error?.error?.message,
            text: 'Error!',
            type: NotificationType.Error,
            autoDisappear: false,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.deleteCategory$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoryActions.deleteCategory),
        mergeMap((action) =>
          this.categoryService.deleteCategory(action.id).pipe(
            map(() => CategoryActions.deleteCategorySuccess({ id: action.id })),
            catchError(error =>
              of(CategoryActions.deleteCategoryFailure({ error }))
            )
          )
        )
      )
    );

    this.deleteCategorySuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoryActions.deleteCategorySuccess),
        mergeMap(() => {
          const notification: NotificationModel = {
            id: Date.now(),
            text: `Category deleted successfully!`,
            type: NotificationType.Information,
            autoDisappear: true,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.deleteCategoryFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CategoryActions.deleteCategoryFailure),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            // text: action.error,
            text: 'Error!',
            type: NotificationType.Error,
            autoDisappear: false,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );
  }
}
