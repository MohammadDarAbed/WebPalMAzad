import { createAction, props } from '@ngrx/store';
import { Product } from '../models/product.model';


export const enum ProductsActionNames {
  LOAD_PRODUCTS = '[Products] Load Products',
  LOAD_PRODUCTS_SUCCESS = '[Products] Load Products Success',
  LOAD_PRODUCTS_FAILURE = '[Products] Load Products Failure',

  LOAD_PRODUCT_BYID = '[Products] Load Product By Id',
  LOAD_PRODUCT_BYID_SUCCESS = '[Products] Load Product By Id Success',
  LOAD_PRODUCT_BYID_FAILURE = '[Products] Load Product By Id Failure',

  CREATE_PRODUCT = '[Products] Create Product',
  CREATE_PRODUCT_SUCCESS = '[Products] Create Product Success',
  CREATE_PRODUCT_FAILURE = '[Products] Create Product Failure',

  UPDATE_PRODUCT = '[Products] Update Product',
  UPDATE_PRODUCT_SUCCESS = '[Products] Update Product Success',
  UPDATE_PRODUCT_FAILURE = '[Products] Update Product Failure',

  DELETE_PRODUCT = '[Products] Delete Product',
  DELETE_PRODUCT_SUCCESS = '[Products] Delete Product Success',
  DELETE_PRODUCT_FAILURE = '[Products] Delete Product Failure',

}

export const loadProducts = createAction(ProductsActionNames.LOAD_PRODUCTS);

export const loadProductsSuccess = createAction(
  ProductsActionNames.LOAD_PRODUCTS_SUCCESS,
  props<{ products: Product[] }>()
);

export const loadProductsFailure = createAction(
  ProductsActionNames.LOAD_PRODUCTS_FAILURE,
  props<{ error: any }>()
);

export const loadProductById = createAction(
  ProductsActionNames.LOAD_PRODUCT_BYID,
  props<{ id: number }>());

export const loadProductByIdSuccess = createAction(
  ProductsActionNames.LOAD_PRODUCT_BYID_SUCCESS,
  props<{ product: Product }>()
);

export const loadProductByIdFailure = createAction(
  ProductsActionNames.LOAD_PRODUCT_BYID_FAILURE,
  props<{ error: any }>()
);

export const createProduct = createAction(
  ProductsActionNames.CREATE_PRODUCT,
  props<{ product: Product }>());

export const createProductSuccess = createAction(
  ProductsActionNames.CREATE_PRODUCT_SUCCESS,
  props<{ product: Product }>()
);

export const createProductFailure = createAction(
  ProductsActionNames.CREATE_PRODUCT_FAILURE,
  props<{ error: any }>()
);

export const updateProduct = createAction(
  ProductsActionNames.UPDATE_PRODUCT,
  props<{ product: Product }>()
);

export const updateProductSuccess = createAction(
  ProductsActionNames.UPDATE_PRODUCT_SUCCESS,
  props<{ product: Product }>()
);

export const updateProductFailure = createAction(
  ProductsActionNames.UPDATE_PRODUCT_FAILURE,
  props<{ error: any }>()
);

export const deleteProduct = createAction(
  ProductsActionNames.DELETE_PRODUCT,
  props<{ id: number }>()
);

export const deleteProductSuccess = createAction(
  ProductsActionNames.DELETE_PRODUCT_SUCCESS,
  props<{ id: number }>()
);

export const deleteProductFailure = createAction(
  ProductsActionNames.DELETE_PRODUCT_FAILURE,
  props<{ error: any }>()
);