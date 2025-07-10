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
  columnsWithStringKeys: Array<TableColumn<T> & { stringKey: string }> = [];

  // For editing, keep track of editing rows indices and forms
  editingRowIndices: Set<number> = new Set();
  editingForms: Map<number, FormGroup> = new Map();

  // Filters state (column key to filter string)
  filters: { [key: string]: string } = {};

  filteredData: T[] = [];

  // Sorting state
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  ngOnInit() {
    this.columnsWithStringKeys = this.config.columns.map(col => ({
      ...col,
      stringKey: String(col.key), // safe string-based key
    }));

    this.displayedColumns = this.columnsWithStringKeys.map(col => col.stringKey);
    this.applyFilters();
  }




  // Filtering rows based on filters object
  applyFilters() {
    this.filteredData = this.data.filter(row =>
      this.columnsWithStringKeys.every(col => {
        const filterValue = this.filters[col.stringKey];
        if (!filterValue) return true; // no filter on this column

        const cellValue = (row as any)[col.stringKey]; // col.key is keyof T - use directly

        return cellValue != null
          ? cellValue.toString().toLowerCase().includes(filterValue.toLowerCase())
          : false;
      })
    );
    this.applySorting();
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

  // Apply sorting to filteredData
  applySorting() {
    if (!this.sortColumn || !this.sortDirection) return;

    const col = this.columnsWithStringKeys.find(c => c.stringKey === this.sortColumn);
    if (!col) return;

    this.filteredData = [...this.filteredData].sort((a, b) => {
      const aValue = (a as any)[this.sortColumn!];
      const bValue = (b as any)[this.sortColumn!];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // In your component class
  getRowValue(row: any, key: keyof any): any {
    return row[key];
  }
  getCellValue(row: any, key: keyof any): any {
    return row[key];
  }

  // Start editing a single row
  startEdit(index: number) {
    this.editingRowIndices.add(index);
    const row = this.filteredData[index];
    const group: any = {};
    this.config.columns.forEach(col => {
      if (col.type && col.type !== 'readonly') {
        group[col.key] = new FormControl((row as any)[col.key]);
      }
    });
    this.editingForms.set(index, new FormGroup(group));
  }

  // Save edited single row
  saveEdit(index: number) {
    const form = this.editingForms.get(index);
    if (!form || !form.valid) return;
    const editedRow = { ...this.filteredData[index], ...form.value };
    const originalIndex = this.data.indexOf(this.filteredData[index]);
    this.data[originalIndex] = editedRow;
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

  // Add new empty row
  // addNewRow() {
  //   const newRow = {} as T;
  //   this.config.columns.forEach(col => {
  //     (newRow as any)[col.key] = '';
  //   });
  //   this.data = [newRow, ...this.data];
  //   this.dataChange.emit(this.data);
  //   this.rowAdded.emit(newRow);
  //   this.applyFilters();
  // }
  addNewRow() {
    const newRow = {} as T;

    this.config.columns.forEach(col => {
      (newRow as any)[col.key] = '';
    });

    this.data = [newRow, ...this.data];
    this.dataChange.emit(this.data);
    this.rowAdded.emit(newRow);

    this.applyFilters();

    // Automatically start editing the new row at index 0
    this.startEdit(0);
  }

  deleteRow(index: number) {
    const rowToDelete = this.filteredData[index];
    const originalIndex = this.data.indexOf(rowToDelete);

    if (originalIndex > -1) {
      this.data = this.data.filter((_, i) => i !== originalIndex);
      this.applyFilters();
      this.dataChange.emit(this.data); // already notifies parent
    }
  }

  // Handle row drag and drop
  dropRow(event: CdkDragDrop<T[]>) {
    if (this.data.length === 0) return;

    // Map filteredData indexes to data indexes
    const prevDataIndex = this.data.indexOf(this.filteredData[event.previousIndex]);
    const currDataIndex = this.data.indexOf(this.filteredData[event.currentIndex]);

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
  dropColumn(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    // Reorder columns config accordingly
    const newColumnsOrder = this.displayedColumns.map(colKey =>
      this.config.columns.find(c => c.key === colKey)!
    );
    this.config.columns = newColumnsOrder;
    this.columnReordered.emit(this.config.columns);
  }

  // Start editing all rows
  startEditAll() {
    this.editingRowIndices.clear();
    this.editingForms.clear();
    this.filteredData.forEach((row, index) => {
      this.editingRowIndices.add(index);
      const group: any = {};
      this.config.columns.forEach(col => {
        if (col.type && col.type !== 'readonly') {
          group[col.key] = new FormControl((row as any)[col.key]);
        }
      });
      this.editingForms.set(index, new FormGroup(group));
    });
  }

  // Save all edits
  saveAllEdits() {
    const newData = [...this.data];
    this.editingRowIndices.forEach(index => {
      const form = this.editingForms.get(index);
      if (form && form.valid) {
        const editedRow = { ...this.filteredData[index], ...form.value };
        const originalIndex = this.data.indexOf(this.filteredData[index]);
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
}
