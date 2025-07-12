import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { TableColumn, TableConfig } from '../table-column';

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
  ],
  templateUrl: './editable-grid.component.html',
  styleUrls: ['./editable-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableGridComponent<T> implements OnInit {
  @Input() config!: TableConfig<T>;
  @Input() data: T[] = [];

  @Output() dataChange = new EventEmitter<T[]>();
  @Output() rowAdded = new EventEmitter<T>();
  @Output() rowEdited = new EventEmitter<{ index: number; row: T }>();
  @Output() rowReordered = new EventEmitter<T[]>();
  @Output() columnReordered = new EventEmitter<TableColumn<T>[]>();

  displayedColumns: string[] = [];
  // For editing, keep track of editing rows indices and forms
  editingRowIndices: Set<number> = new Set();
  editingForms: Map<number, FormGroup> = new Map();

  // Filters state (column key to filter string)
  filters: { [key: string]: string } = {};

  orderedItems: T[] = [];

  // Sorting state
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  ngOnInit() {
    this.displayedColumns = this.config.columns.map(col => String(col.key));
    this.orderedItems = this.data;
  }

  // Filtering rows based on filters object
  applyFilters() {
    this.orderedItems = this.data.filter(row =>
      this.config.columns.every(col => {
        const filterValue = this.filters[String(col.key)];
        if (!filterValue) return true; // no filter on this column

        const cellValue = (row as any)[String(col.key)]; // col.key is keyof T - use directly

        return cellValue != null
          ? cellValue.toString().toLowerCase().includes(filterValue.toLowerCase())
          : false;
      })
    );
  }


  // When filter changes for a column
  onFilterChange(columnKey: string, value: string) {
    this.filters[columnKey] = value;
    this.applyFilters();
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

    this.orderedItems = [...this.orderedItems].sort((a, b) => {
      const aValue = (a as any)[this.sortColumn!];
      const bValue = (b as any)[this.sortColumn!];

      if (aValue == null) return 1; //  descending 
      if (bValue == null) return -1; // ascending

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // In your component class
  getRowValue(row: any, key: string): any {
    return row[key];
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

  private createFormGroup(row: T): FormGroup {
    const group: any = {};
    this.config.columns.forEach(col => {
      if (col.type && col.type !== 'readonly') {
        group[col.key] = new FormControl((row as any)[col.key]);
      }
    });
    return new FormGroup(group);
  }

  // Save edited single row
  saveEdit(index: number) {
    const form = this.editingForms.get(index);
    if (!form || !form.valid) return;
    const editedRow = { ...this.orderedItems[index], ...form.value };
    const originalIndex = this.data.indexOf(this.orderedItems[index]);
    // Create a copy of data array to avoid mutating read-only array
    const newData = [...this.data];
    newData[originalIndex] = editedRow;
    this.data = newData;
    this.dataChange.emit(this.data);
    this.rowEdited.emit({ index: originalIndex, row: editedRow });
    this.editingRowIndices.delete(index);
    this.editingForms.delete(index);
    this.applyFilters();
  }

  // Cancel editing single row
  cancelEdit(index: number) {
    this.editingRowIndices.delete(index);
    this.editingForms.delete(index);
  }

  //   get displayedColumnKeys(): string[] {
  //   return this.config.columns.map(c => String(c.key));
  // }

  addNewRow() {
    const newRow = {} as T;

    this.config.columns.forEach(col => {
      (newRow as any)[col.key] = '';
    });

    this.data = [...this.data, newRow];
    this.dataChange.emit(this.data);
    this.rowAdded.emit(newRow);

    this.applyFilters();

    // Automatically start editing the new row at the last index
    this.startEdit(this.data.length - 1);
  }

  deleteRow(index: number) {
  const rowToDelete = this.orderedItems[index];
  const rowId = this.trackById(index, rowToDelete);

  this.data = this.data.filter(row => this.trackById(0, row) !== rowId);
  this.applyFilters();
  this.dataChange.emit(this.data);
}

  // Handle row drag and drop
  dropRow(event: CdkDragDrop<T[]>) {
    if (this.data.length === 0) return;

    // Map orderedItems indexes to data indexes
    const prevDataIndex = this.data.indexOf(this.orderedItems[event.previousIndex]);
    const currDataIndex = this.data.indexOf(this.orderedItems[event.currentIndex]);

    if (prevDataIndex === -1 || currDataIndex === -1) return;

    // Create a copy of data array to avoid mutating read-only array
    const newData = [...this.data];
    moveItemInArray(newData, prevDataIndex, currDataIndex);
    this.data = newData;
    this.dataChange.emit(this.data);
    this.rowReordered.emit(this.data);
    this.applyFilters();
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

  // Save all edits
  saveAllEdits() {
    const newData = [...this.data];
    this.editingRowIndices.forEach(index => {
      const form = this.editingForms.get(index);
      if (form && form.valid) {
        const editedRow = { ...this.orderedItems[index], ...form.value };
        const originalIndex = this.data.indexOf(this.orderedItems[index]);
        newData[originalIndex] = editedRow;
        this.rowEdited.emit({ index: originalIndex, row: editedRow });
      }
    });
    this.data = newData;
    this.dataChange.emit(this.data);
    this.editingRowIndices.clear();
    this.editingForms.clear();
    this.applyFilters();
  }

  // Cancel all edits
  cancelAllEdits() {
    this.editingRowIndices.clear();
    this.editingForms.clear();
  }

  trackById(index: number, item: T): any {
    return (item as any).id ?? index;
  }
}
