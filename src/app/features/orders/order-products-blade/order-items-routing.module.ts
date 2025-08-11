import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderProductsBladeComponent } from './Component/order-products-blade.component';

const routes: Routes = [
  { path: '', component: OrderProductsBladeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderItemsRoutingModule { }
