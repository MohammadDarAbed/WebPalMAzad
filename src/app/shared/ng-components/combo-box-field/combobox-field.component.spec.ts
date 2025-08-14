import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboboxFieldComponent } from './combobox-field.component';


describe('ComboBoxFieldComponent', () => {
  let component: ComboboxFieldComponent;
  let fixture: ComponentFixture<ComboboxFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComboboxFieldComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ComboboxFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
