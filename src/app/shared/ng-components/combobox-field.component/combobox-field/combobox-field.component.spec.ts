import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomComboboxFieldComponent } from './combobox-field.component';

describe('ComboboxFieldComponent', () => {
  let component: CustomComboboxFieldComponent;
  let fixture: ComponentFixture<CustomComboboxFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomComboboxFieldComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomComboboxFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
