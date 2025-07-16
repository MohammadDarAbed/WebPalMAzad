import { TemplateRef } from "@angular/core";

export enum EditableGridCellType {
  select = 'select',
  readonly = 'readonly',
  text = "text",
  number = "number",
  date = 'date',
  multiSelect = 'multiSelect',
  comboBox = 'comboBox',
}

// Represents a single column definition
export interface TableColumn<T = any> {
  key: string;            // property name in row data
  label: string;                    // header label
  type: EditableGridCellType // input type
  options?: { value: any; label: string }[]; // for select dropdown
  sortable?: boolean;               // enable sorting
  filterable?: boolean;             // enable filtering
  width?: number;                   // optional width (e.g. '150px')
}

export interface TableColumnWithStringKey<T> extends TableColumn<T> {
  stringKey: string;
}

// Represents table configuration inputs
export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  addNewRowEnabled?: boolean;       // allow adding new rows
  editable?: boolean;               // allow editing rows
  readOnly?: boolean;               // Just view grid 
  filterable?: boolean;             // enable filtering
  dragDropRows?: boolean;           // enable row drag and drop
  dragDropColumns?: boolean;        // enable column drag and drop
  headerActionsTemplate?: TemplateRef<any>;  // custom header area
  actionsColumnWidth?: number             // optional actions column width (e.g. '150px')
  useDialogToDelete?: boolean             // optional actions column width (e.g. '150px')
}
