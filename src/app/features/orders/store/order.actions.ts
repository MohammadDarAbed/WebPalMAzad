import { createAction, props } from '@ngrx/store';
import { Order } from '../models/order.mdel';


export const enum OrdersActionNames {
  LOAD_ORDERS = '[Orders] Load Orders',
  LOAD_ORDERS_SUCCESS = '[Orders] Load Orders Success',
  LOAD_ORDERS_FAILURE = '[Orders] Load Orders Failure',

  LOAD_ORDER_BYID = '[Orders] Load Order By Id',
  LOAD_ORDER_BYID_SUCCESS = '[Orders] Load Order By Id Success',
  LOAD_ORDER_BYID_FAILURE = '[Orders] Load Order By Id Failure',

  CREATE_ORDER = '[Orders] Create Order',
  CREATE_ORDER_SUCCESS = '[Orders] Create Order Success',
  CREATE_ORDER_FAILURE = '[Orders] Create Order Failure',

  UPDATE_ORDER = '[Orders] Update Order',
  UPDATE_ORDER_SUCCESS = '[Orders] Update Order Success',
  UPDATE_ORDER_FAILURE = '[Orders] Update Order Failure',

  DELETE_ORDER = '[Orders] Delete Order',
  DELETE_ORDER_SUCCESS = '[Orders] Delete Order Success',
  DELETE_ORDER_FAILURE = '[Orders] Delete Order Failure',
}

export const loadOrders = createAction(OrdersActionNames.LOAD_ORDERS);

export const loadOrdersSuccess = createAction(
  OrdersActionNames.LOAD_ORDERS_SUCCESS,
  props<{ orders: Order[] }>()
);

export const loadOrdersFailure = createAction(
  OrdersActionNames.LOAD_ORDERS_FAILURE,
  props<{ error: any }>()
);

export const loadOrderById = createAction(
  OrdersActionNames.LOAD_ORDER_BYID,
  props<{ id: number }>());

export const loadOrderByIdSuccess = createAction(
  OrdersActionNames.LOAD_ORDER_BYID_SUCCESS,
  props<{ order: Order }>()
);

export const loadOrderByIdFailure = createAction(
  OrdersActionNames.LOAD_ORDER_BYID_FAILURE,
  props<{ error: any }>()
);

export const createOrder = createAction(
  OrdersActionNames.CREATE_ORDER,
  props<{ order: Order }>());

export const createOrderSuccess = createAction(
  OrdersActionNames.CREATE_ORDER_SUCCESS,
  props<{ order: Order }>()
);

export const createOrderFailure = createAction(
  OrdersActionNames.CREATE_ORDER_FAILURE,
  props<{ error: any }>()
);

export const updateOrder = createAction(
  OrdersActionNames.UPDATE_ORDER,
  props<{ order: Order }>()
);

export const updateOrderSuccess = createAction(
  OrdersActionNames.UPDATE_ORDER_SUCCESS,
  props<{ order: Order }>()
);

export const updateOrderFailure = createAction(
  OrdersActionNames.UPDATE_ORDER_FAILURE,
  props<{ error: any }>()
);

export const deleteOrder = createAction(
  OrdersActionNames.DELETE_ORDER,
  props<{ id: number }>()
);

export const deleteOrderSuccess = createAction(
  OrdersActionNames.DELETE_ORDER_SUCCESS,
  props<{ id: number }>()
);

export const deleteOrderFailure = createAction(
  OrdersActionNames.DELETE_ORDER_FAILURE,
  props<{ error: any }>()
);