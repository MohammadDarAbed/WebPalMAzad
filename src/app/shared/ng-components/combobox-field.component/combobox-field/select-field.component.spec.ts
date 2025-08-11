import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomselectFieldComponent } from './select-field.component';

describe('selectFieldComponent', () => {
  let component: CustomselectFieldComponent;
  let fixture: ComponentFixture<CustomselectFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomselectFieldComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomselectFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
