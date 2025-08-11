import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProductsBladeComponent } from './order-products-blade.component';

describe('OrderProductsBladeComponent', () => {
  let component: OrderProductsBladeComponent;
  let fixture: ComponentFixture<OrderProductsBladeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderProductsBladeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderProductsBladeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
