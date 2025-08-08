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
  OnDestroy,
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
import { Subject, takeUntil } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { EditableGridModel } from '../../models/editable-grid.model';

@Pipe({
  name: 'rowValue',
  pure: true
})
export class RowValuePipe implements PipeTransform {
  counter = 0;

  private getNestedValue(obj: any, path?: string): any {
    return path?.split('.').reduce((acc, part) => acc && acc[part], obj);
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

export class EditableGridComponent<T> implements OnInit, OnDestroy {

  constructor(private changeDetectorRef: ChangeDetectorRef, private readonly dialog: MatDialog) { }
  public gridHeaders: string = '';
  public dateFields: string[] = [];

  // #region Inputs
  @Input() config!: TableConfig<T>;
  @Input() data: T[] = [];
  @Input() public validators: any = {};
  @Input()
  set model(value: EditableGridModel<T>) {
    this.innerModel = value;
    this.resetEditorState();
    this.setGridItems();
    this.gridHeaders = this.innerModel.columns.map(col => col.key).toString();

    const dateFields = this.innerModel.columns.filter(c => c.type === EditableGridCellType.date);
    dateFields.forEach(c => {
      if (!this.dateFields.includes(c.key)) this.dateFields.push(c.key);
    });

    this.subscribeToLastCreatedAndDeleted(value);
    this.changeDetectorRef.detectChanges();
  }
  // #endregion

  // #region Outputs
  @Output() dataChange = new EventEmitter<{ key: string, row: any, value: any }>();
  @Output() rowAdded = new EventEmitter<T>();
  @Output() rowDeleted = new EventEmitter<T>();
  @Output() rowEdited = new EventEmitter<{ index: number; row: T }>();
  @Output() rowReordered = new EventEmitter<T[]>();
  @Output() columnReordered = new EventEmitter<TableColumn<T>[]>();
  @Output() cellValueChanged = new EventEmitter<{ row: any; key: string; value: any }>();
  @Output() editFormCreated = new EventEmitter<{ index: number; form: FormGroup }>();
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
  private innerModel!: EditableGridModel<T>;
  public columnGroups: Array<{ groupName: string, columns: any[] }> = [];
  get model(): EditableGridModel<T> { return this.innerModel; }
  private destroyed$ = new Subject<void>();
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit() {
    this.displayedColumns = this.config.columns.map(col => String(col.key));
    this.orderedItems = [...this.model.data];
    this.actionsColumnWidthl = this.config.actionsColumnWidth;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  // #endregion

  // #region Template methods:
  addNewRow() {
    const newRow = {} as T;

    this.config.columns.forEach(col => {
      if (col.key === 'order') {
        (newRow as any)[col.key] = this.orderedItems.length + 1;
      } else {
        (newRow as any)[col.key] = '';
      }
    });

    // Add the new row locally
    this.orderedItems = [...this.orderedItems, newRow];

    this.newRowIndices.add(this.orderedItems.length - 1);

    this.refreshData();
    this.applyFilters();

    this.startEdit(this.orderedItems.length - 1);

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
    const form = this.createFormGroup(this.orderedItems[index]);
    this.editingForms.set(index, form);
    this.editFormCreated.emit({ index, form });
  }

  // Start editing all rows
  startEditAll() {
    this.editingRowIndices.clear();
    this.editingForms.clear();
    this.orderedItems.forEach((row, index) => {
      this.editingRowIndices.add(index);
      const form = this.createFormGroup(row);
      this.editingForms.set(index, form);
      this.editFormCreated.emit({ index, form });
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

  isRowValid(index: number): boolean | undefined {
    return !this.editingForms.get(index)?.valid
  }
  // #endregion



  // #region Helpers:

  private saveRowEdits(index: number): boolean {
    const form = this.editingForms.get(index);
    if (!form || !form.valid) return false;

    const originalRow = this.orderedItems[index];
    const updatedValues = form.value;

    if (!this.newRowIndices.has(index)) {
      // existing row: emit cell changes if any
      const changedKeys = Object.keys(updatedValues).filter(
        key => updatedValues[key] !== (originalRow as any)[key]
      );
      changedKeys.forEach(key => {
        this.cellValueChanged.emit({
          row: originalRow,
          key,
          value: updatedValues[key]
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
    this.changeDetectorRef.markForCheck(); // Trigger UI update if OnPush used

    return true;
  }

  // Filtering rows based on filters object
  applyFilters() {
    this.orderedItems = this.model.data.filter(row =>
      this.config.columns.every(col => {
        const filterValue = this.filters[String(col.key)];
        if (!filterValue) return true;

        const cellValue = col.previewKey
          ? col.previewKey.split('.').reduce((acc: any, part: string) => acc && acc[part], row)
          : (row as any)[String(col.key)];

        return cellValue != null
          ? cellValue.toString().toLowerCase().includes(filterValue.toLowerCase())
          : false;
      })
    );
    this.changeDetectorRef.markForCheck();
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

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    this.changeDetectorRef.markForCheck();
  }


  private getNestedValue(obj: any, path?: string): any {
    return path?.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  private createFormGroup(row: any, rowIndex?: number): FormGroup {
    const group: any = {};
    this.config.columns.forEach((col, index) => {

      if (col.key === 'order' && rowIndex !== undefined) {
        value = rowIndex + 1;
        group[col.key] = new FormControl(value);
      } else if (col.type && col.type !== EditableGridCellType.readonly) {
        if (col.type === EditableGridCellType.select && col.options?.length) {
          if (typeof row[col.key] === 'object') {
            var value = col.key ? row[col.key] : this.getNestedValue(row[col.key], col.valueKey); // give the selected value as an object
          } else { // if the value is not object find the object from the options
            const matchedObject = col.options.find(op => op[col.valueKey || ''] === row[col.key]);
            value = matchedObject || null;
          }
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
    this.model.data = [...this.orderedItems];
    this.changeDetectorRef.markForCheck();
  }


  private subscribeToLastCreatedAndDeleted(model: EditableGridModel<T>) {
    if (model.lastDeletedItemId$) {
      model.lastDeletedItemId$
        .pipe(takeUntil(this.destroyed$))
        .subscribe(id => {
          if (id !== null) {
            this.orderedItems = this.orderedItems.filter(item => (item as any).id !== id);
            this.refreshData();
            this.applyFilters();
          }
        });
    }
    if (model.lastCreatedItem$) {
      model.lastCreatedItem$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((item) => {
          console.log("lastCreatedItem: ", item);
          if (item && (item as any)?.id !== null) {
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
  }

  private setGridItems() {
    this.orderedItems = [...this.model.data];
  }

  private resetEditorState() {
    this.orderedItems = [...this.model.data];
    this.editingRowIndices.clear();
    this.editingForms.clear();
    this.newRowIndices.clear();
  }
  //#endregion




}