import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { OrderService } from '../../Services/order.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { OrderItemsGridConfig } from '../models/OrderItemsGridConfig';
import { TableConfig, TableMode } from '../../../../shared/editable-grid/table-column';
import { Store } from '@ngrx/store';
import { EditableGridModel } from '../../../../shared/models/editable-grid.model';
import { Observable, Subject } from 'rxjs';
import { EditableGridComponent } from '../../../../shared/editable-grid/editable-grid-component/editable-grid.component';
import { selectOrderLoading } from '../../store/order.selectors';
import * as ProductActions from '../../../products/store/products.actions';
import { Product } from '../../../products/models/product.model';
import { selectAllProducts } from '../../../products/store/products.selectors';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-products-blade',
  standalone: true,
  imports: [CommonModule, MatTableModule, EditableGridComponent],
  templateUrl: './order-products-blade.component.html',
  styleUrl: './order-products-blade.component.scss'
})

export class OrderProductsBladeComponent implements OnInit {

  constructor(private ordersService: OrderService,
    private readonly store: Store,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject('BLADE_DATA') public data: { orderId: number, mode: TableMode }
  ) { }
  validators: { [key: string]: { validators: ValidatorFn[], messages?: { [key: string]: string } } } = {
    product: {
      validators: [Validators.required],
      messages: {
        required: "product is required.",
        duplicateProduct: "This product already exists."
      },
    }
  }
  tableConfig: TableConfig<OrderItemsView> = OrderItemsGridConfig();
  gridModel: EditableGridModel<OrderItemsView> = {
    data: [],
    columns: this.tableConfig.columns,
    config: this.tableConfig,
    validators: this.validators,
    lastCreatedItem$: new Subject<OrderItemsView>(),
    lastUpdatedItem$: new Subject<OrderItemsView>(),
    lastDeletedItemId$: new Subject<number>(),
  };
  orderItems$: Observable<OrderItemsView[]> | undefined;
  orderItems: OrderItemsView[] = [];
  isOrderLoading$: Observable<boolean> | undefined;
  products$: Observable<Product[]> | undefined;
  products: Product[] = [];
  headerMessage: string = '';

  ngOnInit(): void {
    this.store.dispatch(ProductActions.loadProducts());
    this.gridModel.data = [];
    this.products$ = this.store.select(selectAllProducts);
    this.isOrderLoading$ = this.store.select(selectOrderLoading);
    this.tableConfig.tableMode = this.data.mode;
    this.products$.subscribe(products => {
      this.products = products;
      this.gridModel.columns
        .find(c => c.key === 'product')!
        .options = products;
    });

    this.ordersService.getOrderById(this.data.orderId).subscribe(order => {
      const newData = order.items.map((item, i) => ({
        order: i + 1,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      }));

      this.gridModel = {
        ...this.gridModel,
        data: newData
      };
    });

    // this.gridModel.lastDeletedItemId$ = this.store.pipe(
    //   select(selectLastDeletedOrderId)
    // );
    // this.gridModel.lastCreatedItem$ = this.store.pipe(
    //   select(selectLastCreatedOrderId)
    // );
    // this.gridModel.lastUpdatedItem$ = this.store.pipe(
    //   select(selectLastUpdatedOrderId)
    // );
  }

  onCellValueChanged(event: { row: any; key: string; value: any }) {
    console.log("From onCellValueChanged");
  }


  onOrderAdded(newOrder: any) {
    console.log(newOrder);
    // const order: Order = {
    //   id: 0,
    //   name: newOrder.name,
    //   isDeleted: false,
    // };
    // this.store.dispatch(OrderActions.createOrder({ order }));
  }

  onOrderDeleted(deletedOrder: OrderItemsView) {
    // this.store.dispatch(OrderActions.deleteOrder({ id: deletedOrder.id }));
  }

  onOrderEdited(event: { index: number; row: any }) {
    console.log(event);

    // const order: Order = {
    //   id: event.row.id,
    //   name: event.row.name,
    //   isDeleted: event.row.isDeleted.value ?? false,
    // };

    // this.store.dispatch(OrderActions.updateOrder({ order }));
  }

  onOrderReordered(reordered: any) {
    console.log('Orders reordered:', reordered);
  }

  rowEditingFormCreated(event: { index: number, originalRow: any; changes: { [key: string]: any }, form: FormGroup, isChangedFromOriginal: boolean }) {
    // if (event.changes['product']) {
    //   const selectedProduct = event.changes['product'];

    //   const priceControl = event.form.get('price');
    //   if (priceControl) {
    //     priceControl.setValue(selectedProduct.price, { emitEvent: false });
    //     this.changeDetectorRef.detectChanges();
    //   }

    //   if (this.checkIfExists(selectedProduct.id, event.index)) {
    //     event.form.get('product')?.setErrors({ duplicateProduct: true });
    //     this.headerMessage = "This product already exists, you can add its quantity";
    //   } else {
    //     event.form.get('product')?.setErrors(null);
    //     this.headerMessage = "";
    //   }

    // }

  }



  onEditFormCreated(event: { index: number; form: FormGroup }) {
    const { index, form } = event;
    const productControl = form.get('product');
    const priceControl = form.get('price');

    if (productControl) {
      productControl.valueChanges.subscribe(value => {
        if (value) {
          const exists = this.checkIfExists(value.id, index);
          if (exists) {
            productControl.setErrors({ duplicateProduct: true });
            this.headerMessage = "This product already exists, you can add its quantity";
          } else {
            productControl.setErrors(null);
            this.headerMessage = "";
          }

          if (priceControl) {
            priceControl.setValue(value.price, { emitEvent: false });
          }
        } else {
          if (priceControl) {
            priceControl.setValue(null, { emitEvent: false });
          }
        }
      });
    }
  }


  checkIfExists(productId: number, rowIndex: number): boolean {
    const productMatchingListWithoutCurrent = (this.gridModel.data as any[])
      .filter(p => p.order !== (rowIndex + 1) && // Without the current product row
        p.product.id == productId) // if the product is already in the grid
      .map(p => p.product);           // then map to product
    if (productMatchingListWithoutCurrent.length > 0) {
      this.headerMessage = "This product already exists, you can add it's quantity";
      return true;
    } else {
      this.headerMessage = ""
    }
    return false;
  }

}

export interface OrderItemsView {
  product: Product;
  quantity: number;
  price: number;
}