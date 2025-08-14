import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-combobox-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatOptionModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
  ],
  templateUrl: './combobox-field.component.html',
  styleUrls: ['./combobox-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxFieldComponent),
      multi: true
    }
  ]
})
export class ComboboxFieldComponent implements OnInit, ControlValueAccessor {

  @Input() options: any[] = [];
  @Input() valueField: string = 'id';
  @Input() textField: string = 'name';
  @Input() placeholder: string = 'Select or type...';
  @Input() disabled = false;
  @Input() errorMessages: string | null = "";
  @Input() validators: ValidatorFn[] = [];
  @Input() formControl: FormControl = new FormControl();

  isSelected = false;
  internalControl = new FormControl();

  filteredOptions: any[] = [];

  private onChange = (value: any) => { };
  onTouched = () => { };

  ngOnInit() {
    this.setValidators(this.validators);
    console.log('ngOnInit - options:', this.options);
    this.filteredOptions = [...this.options];

    this.internalControl.valueChanges.subscribe(value => {
      this.isSelected = !!this.internalControl.value && (typeof this.internalControl.value !== 'string' || this.internalControl.value.trim() !== '');
      this.onChange(value);
    });
  }

  private setValidators(validators: ValidatorFn[] = []) {
    this.internalControl.setValidators(validators);
    this.internalControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  writeValue(value: any): void {
    if (value === null || value === undefined) {
      this.internalControl.setValue(null, { emitEvent: false });
      return;
    }

    if (typeof value === 'object') {
      const found = this.options.find(opt => opt[this.valueField] === value[this.valueField]);
      this.internalControl.setValue(found || value, { emitEvent: false });
    } else {
      const found = this.options.find(opt => opt[this.valueField] === value);
      this.internalControl.setValue(found || null, { emitEvent: false });
    }
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
      this.internalControl.disable();
    } else {
      this.internalControl.enable();
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const value = input?.value ?? '';
    this.filterOptions(value);
  }

  filterOptions(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredOptions = this.options.filter(option =>
      (option[this.textField] || '').toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.value;
    this.internalControl.setValue(selectedOption, { emitEvent: false });
    this.onChange(selectedOption);
  }

  displayFn = (value: any) => {
    if (!value) return '';
    if (typeof value === 'object') return value[this.textField] || '';
    const found = this.options.find(opt => opt[this.valueField] === value);
    return found ? found[this.textField] : '';
  };

  cancelEdit() {
    this.internalControl.setValue(null);
    this.isSelected = false;
    this.onChange(null);
    this.onTouched();
  }
}
