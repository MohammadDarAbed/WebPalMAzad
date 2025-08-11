import { Component, Inject, OnInit } from '@angular/core';
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
    @Inject('BLADE_DATA') public data: { orderId: number, mode: TableMode }
  ) { }

  tableConfig: TableConfig<OrderItemsView> = OrderItemsGridConfig();
  gridModel: EditableGridModel<OrderItemsView> = {
    data: [],
    columns: this.tableConfig.columns,
    config: this.tableConfig,
    lastCreatedItem$: new Subject<OrderItemsView>(),
    lastUpdatedItem$: new Subject<OrderItemsView>(),
    lastDeletedItemId$: new Subject<number>(),
  };
  orderItems$: Observable<OrderItemsView[]> | undefined;
  orderItems: OrderItemsView[] = [];
  isOrderLoading$: Observable<boolean> | undefined;


  ngOnInit(): void {
    this.gridModel.data = [];
    this.isOrderLoading$ = this.store.select(selectOrderLoading);
    this.tableConfig.tableMode = this.data.mode;
    this.ordersService.getOrderById(this.data.orderId).subscribe(order => {
      const newData = order.items.map((item, i) => ({
        order: i + 1,
        name: item.product.name,
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

  // onColumnReordered(newOrder: TableColumn<Order>[]) {
  //   console.log('Columns reordered:', newOrder);
  // }


}

export interface OrderItemsView {
  name: string;
  quantity: number;
  price: number;
}