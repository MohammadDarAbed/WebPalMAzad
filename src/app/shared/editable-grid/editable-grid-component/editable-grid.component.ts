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
import { Observable, of } from 'rxjs';

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

    if (col.type === 'select' && col.options) {
      if (row[key] !== null && typeof row[key] == 'object') {
        value = this.getNestedValue(row, col.previewKey);
      } else {
        value = row[key];
      }
    }
    else {
      var value = col.previewKey ? this.getNestedValue(row, col.previewKey) : row[key];
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
    CustomComboboxFieldComponent
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
  @Input() lastDeletedItemId$: Observable<number | null> = of(null);
  @Input() lastCreatedItem$: Observable<T | null> = of(null);
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
  public newRowAddedIndex = 0;
  public rowEditedIndex = 0;
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit() {
    this.displayedColumns = this.config.columns.map(col => String(col.key));
    this.orderedItems = [...this.data];
    this.actionsColumnWidthl = this.config.actionsColumnWidth;
    this.subscribes();
  }

  public subscribes() {
    this.deleteRowStatus();
    this.createRowStatus();
  }
  public deleteRowStatus() {
    this.lastDeletedItemId$.subscribe(id => {
      if (id !== null) {
        this.orderedItems = this.orderedItems.filter(item => (item as any).id !== id);
        this.refreshData();
        this.applyFilters();
      }
    });
  }

  public createRowStatus() {
    this.lastCreatedItem$.subscribe(item => {
      if (item !== null) {
        // check if it is already exist
        const exists = this.orderedItems.some(i => (i as any).id === (item as any).id);
        if (!exists) {
          this.newRowIndices.delete(this.newRowAddedIndex);
          this.editingRowIndices.delete(this.newRowAddedIndex);
          this.editingForms.delete(this.newRowAddedIndex);
          this.refreshData();
          this.applyFilters();
        }
      }
    });
  }
  // #endregion

  // #region Template methods:
  addNewRow() {
    const newRow = {} as T;

    this.config.columns.forEach(col => {
      if (col.key == 'order') {
        (newRow as any)[col.key] = this.orderedItems.length + 1;
      } else
        (newRow as any)[col.key] = '';
    });

    this.orderedItems = [...this.orderedItems, newRow]; // Add empty row to the end of the array
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
    this.filters[columnKey] = value;
    this.applyFilters();
  }

  // Start editing a single row
  startEdit(index: number) {
    this.editingRowIndices.add(index);
    const row = this.orderedItems[index];
    this.editingForms.set(index, this.createFormGroup(row));
  }

  // Start editing all rows
  startEditAll() {

    this.editingRowIndices.clear();
    this.editingForms.clear();
    this.orderedItems.forEach((row, index) => {
      this.editingRowIndices.add(index);
      this.editingForms.set(index, this.createFormGroup(row));
    });
  }

  // Save edited single row
  saveEdit(index: number) {
    const success = this.saveRowEdits(index);
    if (success) {
      this.refreshData();
      this.applyFilters();
    }
  }

  // Save all rows
  saveAllEdits() {
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
    this.editingRowIndices.delete(index);
    this.editingForms.delete(index);
  }

  deleteRow(index: number) {
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
    this.editingRowIndices.clear();
    this.editingForms.clear();
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

  getFormControl(rowIndex: number, key: string): FormControl {
    return this.editingForms.get(rowIndex)?.get(key) as FormControl;
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
    const updatedValuesObj = updatedValues as Record<string, any>; // TODO make the updated value correct object

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
      this.newRowAddedIndex = index;
      this.rowAdded.emit(editedRow);
    } else {                              // Edited existing row
      this.rowEditedIndex = index;
      this.rowEdited.emit({ index: index, row: editedRow });
      this.editingRowIndices.delete(index);
      this.editingForms.delete(index);
    }
    return true;
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


  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  private createFormGroup(row: any, rowIndex?: number): FormGroup {
    const group: any = {};
    this.config.columns.forEach((col, index) => {

      if (col.key === 'order' && rowIndex !== undefined) {
        value = rowIndex + 1;
        group[col.key] = new FormControl(value);
      } else if (col.type && col.type !== EditableGridCellType.readonly) {
        if (col.type === EditableGridCellType.select && col.options?.length) {
          var value = col.key ? row[col.key] : this.getNestedValue(row[col.key], col.valueKey); // give the selected value as an object
        } else {
          value = col.valueKey ? this.getNestedValue(row, col.valueKey) : (row as any)[col.key];
        }
        group[col.key] = new FormControl(value, this.validators[col.key]?.validators || []);
      } else if (col.type === EditableGridCellType.readonly) {
        value = col.valueKey ? this.getNestedValue(row, col.valueKey) : (row as any)[col.key];
        group[col.key] = new FormControl(value);
      }
    });
    return new FormGroup(group);
  }

  deleteRowProcess(index: number) {
    const rowToDelete = this.orderedItems[index];
    if (this.editingRowIndices.has(index) && !(rowToDelete as any)?.id) { // To allow to delete a new row added before save it
      const newData = this.orderedItems.filter(row => row !== rowToDelete);
      this.refreshData();
      this.applyFilters(); // Recompute orderedItems if needed
      this.orderedItems = newData;
    } else {
      this.rowDeleted.emit(rowToDelete);
    }
    // then deleteRowStatus subscribe will check if the row was deleted before delete the row from table
  }

  refreshData() {
    this.data = [...this.orderedItems];
  }
  //#endregion
}
