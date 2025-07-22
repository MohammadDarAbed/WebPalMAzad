import { Component, Input, forwardRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, ReactiveFormsModule, FormsModule, FormControl, ValidatorFn, Validators, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-combobox-field',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './combobox-field.component.html',
  styleUrls: ['./combobox-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomComboboxFieldComponent),
      multi: true
    }
  ]
})
export class CustomComboboxFieldComponent implements ControlValueAccessor, Validator, OnInit {
  @Input() data: any[] = [];
  @Input() valueField: string = 'id';
  @Input() textField: string = 'name';
  @Input() placeholder: string = 'Select...';
  @Input() disabled = false;
  @Input() validators: ValidatorFn[] = [];
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() public class: any = {};
  @Input() compareObjects: (o1: any, o2: any) => boolean = (o1, o2) => {
    if (o1 === null && o2 === null) return true;
    if (!o1 || !o2) return false;
    return o1[this.valueField] === o2[this.valueField];
  };

  formControl: FormControl = new FormControl();

  selectedItem: any = null;

  onChange = (_: any) => { };
  onTouched = () => { };

  ngOnInit() {
    // console.log("this.validators: ", this.validators);
    this.formControl.setValidators(this.validators);
    this.formControl.updateValueAndValidity();

    // Subscribe to internal formControl value changes to propagate to parent form
    this.formControl.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });

    this.formControl = this.formControl as FormControl;

  }

  writeValue(value: any): void {
    if (value !== null && typeof value !== 'object') {
      // قيمة ID فقط، ابحث في البيانات عن الكائن الكامل
      const matchedObject = this.data.find(item => item[this.valueField] === value);
      this.selectedItem = matchedObject || null;
    } else {
      this.selectedItem = value;
    }
    this.formControl.setValue(this.selectedItem, { emitEvent: false });
  }



  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  onSelectionChange(value: any) {
    this.selectedItem = value;
    this.formControl.setValue(value);
    if (!this.formControl.touched) {
      this.formControl.markAsTouched();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.formControl.errors;
  }

  getErrorMessage(): string {
    if (!this.formControl.errors) return '';

    const errors = this.formControl.errors;

    for (const errorName in errors) {
      if (this.errorMessages[errorName]) {
        return this.errorMessages[errorName];
      }
    }

    // رسالة افتراضية لو لم يكن هناك رسالة مخصصة
    return 'Invalid value';
  }
}
