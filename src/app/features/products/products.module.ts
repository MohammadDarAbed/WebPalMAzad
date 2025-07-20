import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { StoreModule } from '@ngrx/store';
import { productsReducer } from './store/products.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProductsEffects } from './store/products.effects';
import { ProductsRoutingModule } from './product-routing.module';
import { CategoryReducer } from '../categories/store/category.reducer';
import { CategoryEffects } from '../categories/store/category.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ProductListComponent,
    EffectsModule.forFeature([ProductsEffects]),
    EffectsModule.forFeature([CategoryEffects]),
    StoreModule.forFeature('products', productsReducer),
    StoreModule.forFeature('categories', CategoryReducer),

  ],
})
export class ProductsModule { }
