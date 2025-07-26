import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';


export const enum UsersActionNames {
  LOAD_USERS = '[USERS] Load USERS',
  LOAD_USERS_SUCCESS = '[USERS] Load USERS Success',
  LOAD_USERS_FAILURE = '[USERS] Load USERS Failure',

  LOAD_USER_BYID = '[USERS] Load USER By Id',
  LOAD_USER_BYID_SUCCESS = '[USERS] Load USER By Id Success',
  LOAD_USER_BYID_FAILURE = '[USERS] Load USER By Id Failure',

  CREATE_USER = '[USERS] Create USER',
  CREATE_USER_SUCCESS = '[USERS] Create USER Success',
  CREATE_USER_FAILURE = '[USERS] Create USER Failure',

  UPDATE_USER = '[USERS] Update USER',
  UPDATE_USER_SUCCESS = '[USERS] Update USER Success',
  UPDATE_USER_FAILURE = '[USERS] Update USER Failure',

  DELETE_USER = '[USERS] Delete USER',
  DELETE_USER_SUCCESS = '[USERS] Delete USER Success',
  DELETE_USER_FAILURE = '[USERS] Delete USER Failure',
}

export const loadUsers = createAction(UsersActionNames.LOAD_USERS);

export const loadUsersSuccess = createAction(
  UsersActionNames.LOAD_USERS_SUCCESS,
  props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
  UsersActionNames.LOAD_USERS_FAILURE,
  props<{ error: any }>()
);

export const loadUserById = createAction(
  UsersActionNames.LOAD_USER_BYID,
  props<{ id: number }>());

export const loadUserByIdSuccess = createAction(
  UsersActionNames.LOAD_USER_BYID_SUCCESS,
  props<{ user: User }>()
);

export const loadUserByIdFailure = createAction(
  UsersActionNames.LOAD_USER_BYID_FAILURE,
  props<{ error: any }>()
);

export const createUser = createAction(
  UsersActionNames.CREATE_USER,
  props<{ user: User }>());

export const createUserSuccess = createAction(
  UsersActionNames.CREATE_USER_SUCCESS,
  props<{ user: User }>()
);

export const createUserFailure = createAction(
  UsersActionNames.CREATE_USER_FAILURE,
  props<{ error: any }>()
);

export const updateUser = createAction(
  UsersActionNames.UPDATE_USER,
  props<{ user: User }>()
);

export const updateUserSuccess = createAction(
  UsersActionNames.UPDATE_USER_SUCCESS,
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  UsersActionNames.UPDATE_USER_FAILURE,
  props<{ error: any }>()
);

export const deleteUser = createAction(
  UsersActionNames.DELETE_USER,
  props<{ id: number }>()
);

export const deleteUserSuccess = createAction(
  UsersActionNames.DELETE_USER_SUCCESS,
  props<{ id: number }>()
);

export const deleteUserFailure = createAction(
  UsersActionNames.DELETE_USER_FAILURE,
  props<{ error: any }>()
);