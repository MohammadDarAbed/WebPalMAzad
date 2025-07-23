import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as UserActions from './Users.actions';
import * as NotificationActions from '../../../shared/notifications/store/notification.actions';
import { NotificationModel, NotificationType } from '../../../shared/notifications/snackbar.model';
import { ErrorsModel } from '../../../shared/models/errors.model';
import { User } from '../models/user.model';
import { UserService } from './services/Users.service';

@Injectable()
export class UsersEffects {
  loadUsers$;
  loadUserById$;
  createUser$;
  updateUser$;
  deleteUser$;
  createUserSuccess$;
  createUserFailure$;
  updateUserSuccess$;
  deleteUserSuccess$;
  deleteUserFailure$;
  updateUserFailure$;

  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService
  ) {
    this.loadUsers$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.loadUsers),
        mergeMap(() =>
          this.userService.getUsers().pipe(
            tap(users => console.log('[Effect] Users loaded:', users)),
            map(users => UserActions.loadUsersSuccess({ users })),
            catchError((error: ErrorsModel<User>) =>
              of(UserActions.loadUsersFailure({ error }))
            )
          )
        )
      )
    );

    this.loadUserById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.loadUserById),
        mergeMap((action) =>
          this.userService.getUserById(action.id).pipe(
            tap(user => console.log('[Effect] User loaded:', user)),
            map(user => UserActions.loadUserByIdSuccess({ user })),
            catchError(error =>
              of(UserActions.loadUsersFailure({ error }))
            )
          )
        )
      )
    );

    this.createUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createUser),
        mergeMap((action) =>
          this.userService.createUser(action.user).pipe(
            tap(user => console.log('[Effect] User created:', user)),
            map(user => UserActions.createUserSuccess({ user })),
            catchError((error: ErrorsModel<User>) =>
              of(UserActions.createUserFailure({ error }))
            )
          )
        )
      )
    );

    this.createUserFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createUserFailure),
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

    this.createUserSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createUserSuccess),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            text: `User created successfully: ${action.user.name}`,
            type: NotificationType.Information,
            autoDisappear: true,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.updateUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.updateUser),
        mergeMap((action) =>
          this.userService.updateUser(action.user).pipe(
            tap(user => console.log('[Effect] User updated:', user)),
            map(user => UserActions.updateUserSuccess({ user })),
            catchError((error: ErrorsModel<User>) =>
              of(UserActions.updateUserFailure({ error }))
            )
          )
        )
      )
    );

    this.updateUserSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.updateUserSuccess),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            text: `User updated successfully: ${action.user.name}`,
            type: NotificationType.Information,
            autoDisappear: true,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.updateUserFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.updateUserFailure),
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

    this.deleteUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.deleteUser),
        mergeMap((action) =>
          this.userService.deleteUser(action.id).pipe(
            tap(id => console.log('[Effect] User deleted:', id)),
            map(id => UserActions.deleteUserSuccess({ id })),
            catchError(error =>
              of(UserActions.deleteUserFailure({ error }))
            )
          )
        )
      )
    );

    this.deleteUserSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.deleteUserSuccess),
        mergeMap(() => {
          const notification: NotificationModel = {
            id: Date.now(),
            text: `User deleted successfully!`,
            type: NotificationType.Information,
            autoDisappear: true,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.deleteUserFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.deleteUserFailure),
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
