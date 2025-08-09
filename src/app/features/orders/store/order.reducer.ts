import { createReducer, on } from '@ngrx/store';
import * as OrderActions from './order.actions';
import { Order } from '../models/order.mdel';

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: any;
  totalResults: number;
  lastCreatedOrder: Order | null;
  lastDeletedOrderId: number | null;
  lastUpdatedOrder: Order | null;
}

export const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  totalResults: 0,
  lastCreatedOrder: null,
  lastDeletedOrderId: null,
  lastUpdatedOrder: null
};

export const OrderReducer = createReducer(
  initialState,
  on(OrderActions.loadOrders,
    OrderActions.loadOrderById, (state) => ({
      ...state,
      loading: true,
    })),
  on(OrderActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state,
    loading: false,
    orders,
    totalResults: orders.length
  })),
  on(OrderActions.loadOrdersFailure,
    OrderActions.loadOrderByIdFailure,
    OrderActions.createOrderFailure,
    OrderActions.updateOrderFailure,
    OrderActions.deleteOrderFailure,
    (state, action) => ({
      ...state,
      loading: false,
      error: action.error,
      lastCreatedOrder: null,
      lastDeletedOrderId: null,
      lastUpdatedOrder: null
    })),
  on(OrderActions.loadOrderByIdSuccess, (state, { order }) => ({
    ...state,
    loading: false,
    order,
    totalResults: 1,
    error: null
  })),
  on(OrderActions.createOrderSuccess, (state, { order }) => ({
    ...state,
    loading: false,
    orders: [...state.orders, order],
    totalResults: state.totalResults + 1,
    error: null,
    lastCreatedOrder: order
  })),
  on(OrderActions.updateOrderSuccess, (state, { order }) => ({
    ...state,
    loading: false,
    orders: state.orders.map(p => p.id === order.id ? order : p),
    lastUpdatedOrder: order,
    error: null
  })),
  on(OrderActions.deleteOrderSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    orders: state.orders.filter(p => p.id !== id), // remove the order
    totalResults: state.totalResults - 1,
    error: null,
    lastDeletedOrderId: id
  })),
);
