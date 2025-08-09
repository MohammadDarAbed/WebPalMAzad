import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { OrderRoutingModule } from './order-routing.module';
import { OrdersComponent } from './orders.component';
import { OrderEffects } from './store/order.effects';
import { OrderReducer } from './store/order.reducer';
import { CategoryEffects } from '../categories/store/category.effects';
import { CategoryReducer } from '../categories/store/category.reducer';
import { ProductsEffects } from '../products/store/products.effects';
import { productsReducer } from '../products/store/products.reducer';
import { UsersEffects } from '../users/store/Users.effects';
import { UsersReducer } from '../users/store/Users.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OrderRoutingModule,
    OrdersComponent,
    EffectsModule.forFeature([ProductsEffects]),
    EffectsModule.forFeature([UsersEffects]),
    EffectsModule.forFeature([CategoryEffects]),
    StoreModule.forFeature('products', productsReducer),
    StoreModule.forFeature('categories', CategoryReducer),
    StoreModule.forFeature('users', UsersReducer),
    EffectsModule.forFeature([OrderEffects]),
    StoreModule.forFeature('orders', OrderReducer),
  ],
})
export class OrderModule { }
