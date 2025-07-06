import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { StoreModule } from '@ngrx/store';
import { productsReducer } from './store/products.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProductsEffects } from './store/products.effects';
import { ProductsRoutingModule } from './product-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ProductListComponent,
    EffectsModule.forFeature([ProductsEffects]),
    StoreModule.forFeature('products', productsReducer),

  ],
})
export class ProductsModule { }
