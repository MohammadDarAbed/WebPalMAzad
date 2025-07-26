import { createReducer, on } from '@ngrx/store';
import * as UserActions from './Users.actions';
import { User } from '../models/user.model';

export interface UsersState {
  users: User[];
  loading: boolean;
  error: any;
  totalResults: number;

}

export const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  totalResults: 0

};

export const UsersReducer = createReducer(
  initialState,
  on(UserActions.loadUsers,
    UserActions.loadUserById, (state) => ({
      ...state,
      loading: true,
    })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    users,
    totalResults: users.length
  })),
  on(UserActions.loadUsersFailure,
    UserActions.loadUserByIdFailure,
    UserActions.createUserFailure,
    UserActions.updateUserFailure,
    UserActions.deleteUserFailure,
    (state, action) => ({
      ...state,
      loading: false,
      error: action.error,

    })),
  on(UserActions.loadUserByIdSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
    totalResults: 1,
    error: null
  })),
  on(UserActions.createUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    users: [...state.users, user],
    totalResults: state.totalResults + 1,
    error: null
  })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    users: state.users.map(p => p.id === user.id ? user : p),
    error: null
  })),
  on(UserActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    users: state.users.filter(p => p.id !== id), // remove the User
    totalResults: state.totalResults - 1,
    error: null
  })),
);
