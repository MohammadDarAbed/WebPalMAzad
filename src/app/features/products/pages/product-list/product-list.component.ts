import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ProductActions from '../../store/products.actions';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { selectAllProducts, selectProductLoading, selectProductError } from '../../store/products.selectors';
import { CommonModule } from '@angular/common';
import { TableColumn, TableConfig } from '../../../../shared/editable-grid/table-column';
import { ProductGridConfig } from '../../models/product-grid-form';
import { EditableGridComponent } from '../../../../shared/editable-grid/editable-grid-component/editable-grid.component';

@Component({
  standalone: true,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [CommonModule, EditableGridComponent]
})

export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  currency: string = "$";
  products: Product[] = [];
  constructor(private store: Store) {
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductLoading);
    this.error$ = this.store.select(selectProductError);
  }

  ngOnInit() {
    this.store.dispatch(ProductActions.loadProducts());
    this.products$.subscribe(products => {
      this.products = products;
    });
  }

  tableConfig: TableConfig<Product> = ProductGridConfig();


  onProductsChange(updated: any) {
    this.tableUpdate();
    console.log('Products updated:', this.products);
  }

  onProductAdded(newProduct: Product) {
    console.log('Product added:', newProduct);
  }

  onProductEdited(event: { index: number; row: any }) {
    console.log(`Product at index ${event.index} edited:`, event.row);
    this.store.dispatch(ProductActions.updateProduct({ product: event.row }));
  }

  onProductReordered(reordered: any) {
    console.log('Products reordered:', reordered);
  }

  onColumnReordered(newOrder: TableColumn<Product>[]) {
    console.log('Columns reordered:', newOrder);
  }

  tableUpdate() {
    this.products$.subscribe(products =>
      this.products = products
    );
  }

}