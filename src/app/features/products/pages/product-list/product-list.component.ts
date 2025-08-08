import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as ProductActions from '../../store/products.actions';
import * as CategoryActions from '../../../categories/store/category.actions';
import * as UsersActions from '../../../users/store/Users.actions';
import { Observable, Subject } from 'rxjs';
import { Product } from '../../models/product.model';
import { selectAllProducts, selectProductLoading, selectProductError, selectLastDeletedProductId, selectLastCreatedProductId, selectLastUpdatedProductId } from '../../store/products.selectors';
import { CommonModule } from '@angular/common';
import { TableColumn, TableConfig } from '../../../../shared/editable-grid/table-column';
import { ProductGridConfig } from '../../models/product-grid-form';
import { EditableGridComponent } from '../../../../shared/editable-grid/editable-grid-component/editable-grid.component';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../shared/editable-grid/Validations/validators.custom';
import { Category } from '../../../categories/Models/category.model';
import { selectAllCategories } from '../../../categories/store/category.selectors';
import { User } from '../../../users/models/user.model';
import { selectAllUsers } from '../../../users/store/Users.selectors';
import { EditableGridModel } from '../../../../shared/models/editable-grid.model';
import { ProductState } from '../../store/products.reducer';

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
  users$: Observable<User[]>;
  currency: string = "$";
  products: Product[] = [];
  categories: Category[] = [];
  users: User[] = [];
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
  gridModel: EditableGridModel<Product> = {
    data: [],
    columns: this.tableConfig.columns,
    validators: this.validators,
    config: this.tableConfig,
    lastCreatedItem$: new Subject<Product>(),
    lastDeletedItemId$: new Subject<number>(),
    lastUpdatedItem$: new Subject<Product>(),
  };

  constructor(private store: Store<ProductState>) {
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductLoading);
    this.error$ = this.store.select(selectProductError);
    this.categories$ = this.store.select(selectAllCategories);
    this.users$ = this.store.select(selectAllUsers);
  }

  ngOnInit() {
    this.store.dispatch(CategoryActions.loadCategories());
    this.store.dispatch(ProductActions.loadProducts());
    this.store.dispatch(UsersActions.loadUsers());

    this.products$.subscribe(products => {
      this.gridModel.data = products.map((p, i) => ({ ...p, order: i + 1 }));
    });

    // Categories & users feed into the column options
    this.categories$.subscribe(cats => {
      this.gridModel.columns
        .find(c => c.key === 'category')!
        .options = cats;
    });
    this.users$.subscribe(users => {
      this.gridModel.columns
        .find(c => c.key === 'seller')!
        .options = users;
    });
    this.gridModel.lastDeletedItemId$ = this.store.pipe(
      select(selectLastDeletedProductId)
    );
    this.gridModel.lastCreatedItem$ = this.store.pipe(
      select(selectLastCreatedProductId)
    );
    this.gridModel.lastUpdatedItem$ = this.store.pipe(
      select(selectLastUpdatedProductId)
    );
  }

  /** 
  Called when change row and click on save.
    - row: the old row data
    - key: the key of the column that was changed
    - value: the new value of the column
  */
  onCellValueChanged(event: { row: any; key: string; value: any }) {
    console.log("From onCellValueChanged");
  }

  /**
 * Called when a new edit FormGroup is created for a row in the editable grid.
 * This is a hook to apply custom dynamic logic to form controls, such as:
 * - Subscribing to value changes of fields
 * - Automatically updating related fields based on selection
 * - Adding validators or modifying field states dynamically
 *
 * This function is useful when you need to implement behavior that depends
 * on user input during editing.
 */

  onEditFormCreated(event: { index: number; form: FormGroup }) {
    console.log("From onEditFormCreated");
    const { index, form } = event;

    const categoryControl = form.get('category');
    if (categoryControl) {
      categoryControl.valueChanges.subscribe(value => {
        // assuming value is an object with name property
        if (value?.name === 'Food') {
          const descriptionControl = form.get('description');
          if (descriptionControl) {
            descriptionControl.setValue('Food', { emitEvent: false });
          }
        }
      });
    }
  }


  onProductAdded(newProduct: any) {
    const product: Product = {
      id: 0,
      name: newProduct.name,
      price: newProduct.price,
      description: newProduct.description,
      categoryId: newProduct.category?.id,
      isDeleted: false,
      productQR: newProduct.productQR,
      condition: newProduct.condition?.id,
      isHiddenSellerInfo: newProduct.isHiddenSellerInfo.value ?? false,
      sellerId: newProduct.seller?.id,
      isPublished: newProduct.isPublished.value ?? false,
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
      categoryId: event.row.category.id,
      isDeleted: false,
      productQR: event.row.productQR,
      condition: event.row.condition?.id,
      isHiddenSellerInfo: event.row.isHiddenSellerInfo.value ?? false,
      sellerId: event.row.seller.id,
      isPublished: event.row.isPublished.value ?? false,
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
