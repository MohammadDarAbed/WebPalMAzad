import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  Pipe,
  PipeTransform,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { EditableGridCellType, TableColumn, TableConfig } from '../table-column';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomComboboxFieldComponent } from '../../ng-components/combobox-field.component/combobox-field/combobox-field.component';

@Pipe({
  name: 'rowValue',
  pure: true
})
export class RowValuePipe implements PipeTransform {
  counter = 0;

  private getNestedValue(obj: any, path: string): any { // TODO: Remove this method after enhance the select fields
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  transform(row: any, key: string, columns: TableColumn<any>[]): any {
    const col = columns.find(c => c.key === key);
    if (!col) return null;

    const value = col.previewKey ? this.getNestedValue(row, col.previewKey) : row[key];

    if (col.type === 'select' && col.options) {
      const option = col.options.find(opt => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  }
}

@Component({
  selector: 'app-editable-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    DragDropModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RowValuePipe,
    FlareComboboxFieldComponent
  ],
  templateUrl: './editable-grid.component.html',
  styleUrls: ['./editable-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EditableGridComponent<T> implements OnInit {

  constructor(private readonly dialog: MatDialog) { }

  // #region Inputs
  @Input() config!: TableConfig<T>;
  @Input() data: T[] = [];
  @Input() public validators: any = {};
  // #endregion

  // #region Outputs
  @Output() dataChange = new EventEmitter<T[]>();
  @Output() rowAdded = new EventEmitter<T>();
  @Output() rowDeleted = new EventEmitter<T>();
  @Output() rowEdited = new EventEmitter<{ index: number; row: T }>();
  @Output() rowReordered = new EventEmitter<T[]>();
  @Output() columnReordered = new EventEmitter<TableColumn<T>[]>();
  @Output() cellValueChanged = new EventEmitter<{ row: any; key: string; value: any }>();
  // #endregion


  // #region View Queries
  @ViewChildren('firstEditableInput') firstEditableInputs!: QueryList<ElementRef<HTMLInputElement>>;
  // #endregion

  // #region Variables 
  displayedColumns: string[] = [];
  editingRowIndices: Set<number> = new Set();  // For editing, keep track of editing rows indices and forms
  editingForms: Map<number, FormGroup> = new Map();
  filters: { [key: string]: string } = {}; // Filters state (column key to filter string)
  orderedItems: T[] = [];
  newRowIndices: Set<number> = new Set(); // Track indices of newly added rows  
  sortColumn: string | null = null;// Sorting state
  sortDirection: 'asc' | 'desc' | null = null;
  actionsColumnWidthl?: number = 120;

  // #endregion

  // #region Lifecycle Hooks
  ngOnInit() {
    this.displayedColumns = this.config.columns.map(col => String(col.key));
    this.orderedItems = [...this.data];
    this.actionsColumnWidthl = this.config.actionsColumnWidth;
  }
  // #endregion

  // #region Template methods:
  addNewRow() {
    const newRow = {} as T;

    this.config.columns.forEach(col => {
      (newRow as any)[col.key] = '';
    });

    this.orderedItems = [...this.orderedItems, newRow];
    this.newRowIndices.add(this.orderedItems.length - 1);
    // this.dataChange.emit(this.orderedItems);
    this.refreshData();

    this.applyFilters();

    // Automatically start editing the new row at the last index
    this.startEdit(this.orderedItems.length - 1);

    // Focus after view updates
    setTimeout(() => {
      const inputToFocus = this.firstEditableInputs.get(this.firstEditableInputs.length - 1);
      inputToFocus?.nativeElement.focus();
    }, 100);
  }

  // When filter changes for a column
  onFilterChange(columnKey: string, value: string) {
    console.log("From onFilterChange: ", columnKey, value);
    this.filters[columnKey] = value;
    this.applyFilters();
  }

  // Start editing a single row
  startEdit(index: number) {
    console.log("From startEdit: ", index);
    this.editingRowIndices.add(index);
    const row = this.orderedItems[index];
    this.editingForms.set(index, this.createFormGroup(row));
  }

  // Start editing all rows
  startEditAll() {
    console.log("From startEditAll");

    this.editingRowIndices.clear();
    this.editingForms.clear();
    this.orderedItems.forEach((row, index) => {
      this.editingRowIndices.add(index);
      this.editingForms.set(index, this.createFormGroup(row));
    });
  }

  // Save edited single row
  saveEdit(index: number) {
    console.log("From saveEdit: ", index);
    const success = this.saveRowEdits(index);
    if (success) {
      this.refreshData();
      this.applyFilters();
    }
  }

  // Save all rows
  saveAllEdits() {
    console.log("From saveAllEdits");
    let hasChanges = false;

    this.editingRowIndices.forEach(index => {
      const success = this.saveRowEdits(index);
      if (success) hasChanges = true;
    });

    if (hasChanges) {
      this.refreshData();
      this.applyFilters();
    }
  }

  // Cancel editing single row
  cancelEdit(index: number) {
    console.log("From cancelEdit: ", index);
    this.editingRowIndices.delete(index);
    this.editingForms.delete(index);
  }

  deleteRow(index: number) {
    console.log("From deleteRow: ", index);
    if (this.config.useDialogToDelete) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        width: '400px',
        data: {
          title: 'Delete Row Confirmation',
          message: 'Are you sure you want to delete this item? This action cannot be undone.'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteRowProcess(index);
        }
      });
    }
    else {
      this.deleteRowProcess(index);
    }
  }
  // Handle row drag and drop
  dropRow(event: CdkDragDrop<T[]>) {
    console.log("From dropRow: ", event);
    if (this.orderedItems.length === 0) return;

    // Map orderedItems indexes to data indexes
    const prevDataIndex = this.orderedItems.indexOf(this.orderedItems[event.previousIndex]);
    const currDataIndex = this.orderedItems.indexOf(this.orderedItems[event.currentIndex]);

    if (prevDataIndex === -1 || currDataIndex === -1) return;

    // Create a copy of data array to avoid mutating read-only array
    const newData = [...this.orderedItems];
    moveItemInArray(newData, prevDataIndex, currDataIndex);
    this.orderedItems = newData;
    this.rowReordered.emit(this.orderedItems);
    this.applyFilters();
  }

  // Cancel all edits
  cancelAllEdits() {
        console.log("From cancelAllEdits");

    this.editingRowIndices.clear();
    this.editingForms.clear();
  }

  trackById(index: number, item: T): any {
    return (item as any).id ?? index;
  }
  // #endregion



  // #region Helpers:

  private saveRowEdits(index: number): boolean {
    const form = this.editingForms.get(index);
    if (!form || !form.valid) return false;

    const originalRow = this.orderedItems[index];
    // const updatedValues = { ...form.value };  // clone form values
    const updatedValues = form.value;
    const originalRowObj = originalRow as Record<string, any>;
    const updatedValuesObj = updatedValues as Record<string, any>;


    this.config.columns.forEach(col => {
      if (col.type === EditableGridCellType.select && updatedValues[col.key]) {
        updatedValues[col.key] = updatedValues[col.key].value;
      }
    });
    if (!this.newRowIndices.has(index)) { // call cellValueChanged just in the edit mode not in add
      const changedKeys = Object.keys(updatedValuesObj).filter(
        key => updatedValuesObj[key] !== originalRowObj[key]
      );
      changedKeys.forEach(key => {
        this.cellValueChanged.emit({
          row: originalRow,
          key,
          value: updatedValuesObj[key]
        });
      });
    }

    const editedRow = { ...originalRow, ...updatedValues };
    this.orderedItems[index] = editedRow;

    if (this.newRowIndices.has(index)) { // Added new row
      this.rowAdded.emit(editedRow);
      this.newRowIndices.delete(index);
    } else {                              // Edited existing row
      const originalIndex = this.orderedItems.indexOf(originalRow);
      this.rowEdited.emit({ index: originalIndex, row: editedRow });
    }

    this.editingRowIndices.delete(index);
    this.editingForms.delete(index);
    return true;
  }

  getErrorMessage(formGroup: FormGroup, key: string): string | null {
    const control = formGroup.get(key);
    if (!control || !control.errors) return null;

    const errors = control.errors;
    const validatorMessages = this.validators[key]?.messages || {};

    for (const errorName in errors) {
      if (validatorMessages[errorName]) {
        if (errorName === 'max') {
          return validatorMessages[errorName].replace('{max}', errors[errorName].max);
        }
        if (errorName === 'min') {
          return validatorMessages[errorName].replace('{min}', errors[errorName].min);
        }
        return validatorMessages[errorName];
      }
    }
    return null;
  }

  // Filtering rows based on filters object
  applyFilters() {
    this.orderedItems = this.data.filter(row =>
      this.config.columns.every(col => {
        const filterValue = this.filters[String(col.key)];
        if (!filterValue) return true; // no filter on this column

        const cellValue = col.previewKey ? col.previewKey.split('.').reduce((acc: any, part: string) => acc && acc[part], row) : (row as any)[String(col.key)];

        return cellValue != null
          ? cellValue.toString().toLowerCase().includes(filterValue.toLowerCase())
          : false;
      })
    );
  }

  // When header clicked for sorting
  onSort(columnKey: string) {
    if (this.sortColumn === columnKey) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }

  // Apply sorting to orderedItems
  applySorting() {
    if (!this.sortColumn || !this.sortDirection) return;

    const col = this.config.columns.find(c => c.key === this.sortColumn);
    if (!col) return;

    const getNestedValue = (obj: any, path: string): any => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    this.orderedItems = [...this.orderedItems].sort((a, b) => {
      const aValue = col.previewKey ? getNestedValue(a, col.previewKey) : (a as any)[this.sortColumn!];
      const bValue = col.previewKey ? getNestedValue(b, col.previewKey) : (b as any)[this.sortColumn!];

      if (aValue == null) return 1; //  descending 
      if (bValue == null) return -1; // ascending

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // In your component class
  // getRowValue(row: any, key: string): any {
  //   const col = this.config.columns.find(c => c.key === key);
  //   if (col && col.type === 'select' && col.options) {
  //     const option = col.options.find((opt: any) => opt.value === row[key]);
  //     return option ? option.label : row[key];
  //   }
  //   // this.dataChange.emit({value: row, key: key} as any);
  //   return row[key];
  // }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  private createFormGroup(row: T): FormGroup {
    const group: any = {};
    this.config.columns.forEach((col, index) => {
      let value: any;

      if (col.key === 'order' && rowIndex !== undefined) {
        value = rowIndex + 1;
        group[col.key] = new FormControl({ value, disabled: true });
      } else if (col.type && col.type !== EditableGridCellType.readonly) {
        if (col.type === EditableGridCellType.select && col.options?.length) {
          const idValue = col.valueKey ? this.getNestedValue(row, col.valueKey) : (row as any)[col.key];
          value = col.options.find(opt => opt.value === idValue) || null;
        } else {
          value = col.valueKey ? this.getNestedValue(row, col.valueKey) : (row as any)[col.key];
        }
        group[col.key] = new FormControl(value, this.validators[col.key]?.validators || []);
      } else if (col.type === EditableGridCellType.readonly) {
        value = col.valueKey ? this.getNestedValue(row, col.valueKey) : (row as any)[col.key];
        group[col.key] = new FormControl({ value, disabled: true });
      }
    });
    return new FormGroup(group);
  }

  //   get displayedColumnKeys(): string[] {
  //   return this.config.columns.map(c => String(c.key));
  // }

  deleteRowProcess(index: number) {
    const rowToDelete = this.orderedItems[index];
    // Directly remove the item from `data` by object reference
    const newData = this.orderedItems.filter(row => row !== rowToDelete);
    this.orderedItems = newData;

    this.rowDeleted.emit(rowToDelete);
    this.refreshData();
    this.applyFilters(); // Recompute orderedItems if needed

  }

  // Handle column drag and drop
  // dropColumn(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  //   // Reorder columns config accordingly
  //   const newColumnsOrder = this.displayedColumns.map(colKey =>
  //     this.config.columns.find(c => c.key === colKey)!
  //   );
  //   this.config.columns = newColumnsOrder;
  //   this.columnReordered.emit(this.config.columns);
  // }

  refreshData() {
    this.data = [...this.orderedItems];
  }
  //#endregion


  getFormControl(rowIndex: number, key: string): FormControl {
    return this.editingForms.get(rowIndex)?.get(key) as FormControl;
  }
}
