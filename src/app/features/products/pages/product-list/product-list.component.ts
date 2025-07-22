import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ProductActions from '../../store/products.actions';
import * as CategoryActions from '../../../categories/store/category.actions';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { selectAllProducts, selectProductLoading, selectProductError } from '../../store/products.selectors';
import { CommonModule } from '@angular/common';
import { TableColumn, TableConfig } from '../../../../shared/editable-grid/table-column';
import { ProductGridConfig } from '../../models/product-grid-form';
import { EditableGridComponent } from '../../../../shared/editable-grid/editable-grid-component/editable-grid.component';
import { ValidatorFn, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../shared/editable-grid/Validations/validators.custom';
import { Category } from '../../../categories/Models/category.model';
import { selectAllCategories } from '../../../categories/store/category.selectors';
import { CategoriesActionNames } from '../../../categories/store/category.actions';

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
  categories$: Observable<Category[]>;
  currency: string = "$";
  products: Product[] = [];
  categories: Category[] = [];
  tableConfig: TableConfig<Product> = ProductGridConfig();

  validators: { [key: string]: { validators: ValidatorFn[], messages?: { [key: string]: string } } } = {
    name: {
      validators: [Validators.required, Validators.maxLength(50)],
      messages: {
        required: "Name is required.",
        maxlength: "This field must be at most 50 characters.",
      }
    },
    price: {
      validators: [Validators.required, Validators.min(0)],
      messages: {
        required: "Price is required.",
        min: "Price must be greater than 0.",
      }
    },
    description: {
      validators: [Validators.maxLength(500)],
      messages: {
        maxlength: "This field must be at most 500 characters.",
      }
    },
    productQR: {
      validators: [CustomValidators.noSpaces()],
      messages: {
        noSpaces: "Name must not contain spaces."
      }
    },
    category: {
      validators: [Validators.required],
      messages: {
        required: "Category is required."
      }
    }
  };

  constructor(private store: Store) {
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductLoading);
    this.error$ = this.store.select(selectProductError);
    this.categories$ = this.store.select(selectAllCategories);
  }

  ngOnInit() {
    this.store.dispatch(CategoryActions.loadCategories());
    this.store.dispatch(ProductActions.loadProducts());

    this.products$.subscribe(products => {
      this.products = products;
      const orderedProducts = products.map((p, i) => ({ ...p, order: i + 1 }));
      this.products = orderedProducts;

    });

    this.categories$.subscribe(categories => {
      this.categories = categories;

      const categoryColumn = this.tableConfig.columns.find(col => col.key === 'category');
      if (categoryColumn) {
        categoryColumn.options = categories.map(category => ({
          value: category.id,
          label: category.name
        }));
      }
    });

  }



  onProductsChange(updated: any) {
    console.log("OnChange: ", updated);
  }

  onProductAdded(newProduct: any) {
    const product: Product = {
      id: 0,
      name: newProduct.name,
      price: newProduct.price,
      description: newProduct.description,
      categoryId: newProduct.category,
      isDeleted: false,
      productQR: newProduct.productQR,
      condition: newProduct.condition,
      isHiddenSellerInfo: newProduct.isHiddenSellerInfo ?? false,
      sellerId: newProduct.seller,
      isPublished: newProduct.isPublished ?? false,
    };
    this.store.dispatch(ProductActions.createProduct({ product }));
  }

  onProductDeleted(deletedProduct: Product) {
    this.store.dispatch(ProductActions.deleteProduct({ id: deletedProduct.id }));
  }

  onProductEdited(event: { index: number; row: any }) {
    const product: Product = {
      id: event.row.id,
      name: event.row.name,
      price: event.row.price,
      description: event.row.description,
      categoryId: event.row.category,
      isDeleted: false,
      productQR: event.row.productQR,
      condition: event.row.condition,
      isHiddenSellerInfo: event.row.isHiddenSellerInfo,
      sellerId: event.row.seller,
      isPublished: event.row.isPublished,
    };

    this.store.dispatch(ProductActions.updateProduct({ product }));
  }

  onProductReordered(reordered: any) {
    console.log('Products reordered:', reordered);
  }

  onColumnReordered(newOrder: TableColumn<Product>[]) {
    console.log('Columns reordered:', newOrder);
  }
}
