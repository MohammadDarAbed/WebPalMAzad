import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectFieldComponent } from './select-field.component';

describe('selectFieldComponent', () => {
  let component: CustomSelectFieldComponent;
  let fixture: ComponentFixture<CustomSelectFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomSelectFieldComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomSelectFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
