import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoriesComponent } from './pages/categories.component';
import { CategoryEffects } from './store/category.effects';
import { CategoryReducer } from './store/category.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    CategoriesComponent,
    EffectsModule.forFeature([CategoryEffects]),
    StoreModule.forFeature('categories', CategoryReducer),
  ],
})
export class CategoryModule { }
