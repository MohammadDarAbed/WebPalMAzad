import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as OrderActions from '../store/order.actions';
import * as UsersActions from '../../users/store/Users.actions';
import { select, Store } from '@ngrx/store';
import { ValidatorFn, Validators } from '@angular/forms';
import { Address, Order } from '../models/order.mdel';
import { TableConfig, TableColumn, TableMode } from '../../../shared/editable-grid/table-column';
import { EditableGridModel } from '../../../shared/models/editable-grid.model';
import { selectAllOrders, selectLastCreatedOrderId, selectLastDeletedOrderId, selectLastUpdatedOrderId, selectOrderLoading } from '../store/order.selectors';
import { EditableGridComponent } from '../../../shared/editable-grid/editable-grid-component/editable-grid.component';
import { OrderGridConfig } from '../models/OrderGridConfig';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { BladeService } from '../../../shared/tree-blade-menu/Services/blade.service';
import { OrderProductsBladeComponent } from '../order-products-blade/Component/order-products-blade.component';
import { User } from '../../users/models/user.model';
import { selectAllUsers } from '../../users/store/Users.selectors';

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  imports: [CommonModule,
    EditableGridComponent,
    MatButtonToggleModule,
    MatIconModule]
})
export class OrdersComponent implements OnInit {
  // validators: { [key: string]: { validators: ValidatorFn[], messages?: { [key: string]: string } } } = {
  //   name: {
  //     validators: [Validators.required, Validators.maxLength(50)],
  //     messages: {
  //       required: "Name is required.",
  //       maxlength: "This field must be at most 50 characters.",
  //     }
  //   }
  // }
  tableConfig: TableConfig<Order> = OrderGridConfig();
  gridModel: EditableGridModel<Order> = {
    data: [],
    columns: this.tableConfig.columns,
    // validators: this.validators,
    config: this.tableConfig,
    lastCreatedItem$: new Subject<Order>(),
    lastUpdatedItem$: new Subject<Order>(),
    lastDeletedItemId$: new Subject<number>(),
  };
  orders$: Observable<Order[]> | undefined;
  users$: Observable<User[]> | undefined;
  isOrderLoading$: Observable<boolean> | undefined;
  orders: Order[] = [];
  headerMessage: string = '';
  openedRowIndex: number | null = null;
  constructor(private readonly store: Store,
    private bladeService: BladeService
  ) { }

  ngOnInit(): void {
    this.orders$ = this.store.select(selectAllOrders);
    this.users$ = this.store.select(selectAllUsers);
    this.isOrderLoading$ = this.store.select(selectOrderLoading);
    this.store.dispatch(OrderActions.loadOrders());
    this.store.dispatch(UsersActions.loadUsers());
    this.orders$.subscribe((orders) => {
      this.orders = orders
      this.gridModel.data = orders.map((p, i) => ({ ...p, order: i + 1, address: this.getAddressTxt(p.address) as any }));
    });
    this.users$.subscribe(users => {
      this.gridModel.columns
        .find(c => c.key === 'buyer')!
        .options = users;
    });

    this.gridModel.lastDeletedItemId$ = this.store.pipe(
      select(selectLastDeletedOrderId)
    );
    this.gridModel.lastCreatedItem$ = this.store.pipe(
      select(selectLastCreatedOrderId)
    );
    this.gridModel.lastUpdatedItem$ = this.store.pipe(
      select(selectLastUpdatedOrderId)
    );

  }

  getAddressTxt(address: Address): string {
    return address.country + '-' + address.city + '-' + address.street + '-';
  }

  onCellValueChanged(event: { row: any; key: string; value: any }) {
    console.log("From onCellValueChanged");
  }


  onOrderAdded(newOrder: any) {
    // const order: Order = {
    //   id: 0,
    //   name: newOrder.name,
    //   isDeleted: false,
    // };
    // this.store.dispatch(OrderActions.createOrder({ order }));
  }

  onOrderDeleted(deletedOrder: Order) {
    // this.store.dispatch(OrderActions.deleteOrder({ id: deletedOrder.id }));
  }

  onOrderEdited(event: { index: number; row: any }) {
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

  onColumnReordered(newOrder: TableColumn<Order>[]) {
    console.log('Columns reordered:', newOrder);
  }

  openNewEditBlade(event: { key: string, rowIndex: number }) {
    this.openedRowIndex = event.rowIndex;
    var order = this.gridModel.data[event.rowIndex];
    if (event.key == "items") {
      this.bladeService.openBlade({
        key: 'product-list',
        title: 'Product List',
        component: OrderProductsBladeComponent,
        data: { orderId: order.id, mode: TableMode.Edit }
      });
    }
  }

  openNewViewBlade(event: { key: string, rowIndex: number }) {
    this.openedRowIndex = event.rowIndex;
    var order = this.gridModel.data[event.rowIndex];
    if (event.key == "items") {
      this.bladeService.openBlade({
        key: 'product-list',
        title: 'Product List',
        component: OrderProductsBladeComponent,
        data: { orderId: order.id, mode: TableMode.View }
      });
    }
  }

  hideMultipleSelectionIndicator() {

  }
}

