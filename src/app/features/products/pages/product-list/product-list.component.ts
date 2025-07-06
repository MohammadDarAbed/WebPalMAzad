import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ProductActions from '../../store/products.actions';
import { Observable } from 'rxjs';
import { Product } from '../../store/products.models';
import { selectAllProducts, selectProductLoading, selectProductError } from '../../store/products.selectors';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [CommonModule]
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  currency: string = "$";

  constructor(private store: Store) {
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductLoading);
    this.error$ = this.store.select(selectProductError);
  }

  ngOnInit() {
    this.store.dispatch(ProductActions.loadProducts());
  }
}
