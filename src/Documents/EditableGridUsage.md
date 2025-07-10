# Editable Grid Component Documentation

## Overview

The Editable Grid component is a reusable Angular component designed to display tabular data with features such as:

- Inline editing of rows (single or multiple rows simultaneously)
- Adding new rows
- Deleting rows
- Sorting columns
- Filtering columns
- Drag and drop reordering of rows and columns

This component is implemented as `EditableGridComponent` in the `src/app/shared/components/editable-table` directory.

## Key Features

### 1. Multi-row Editing

- Users can edit one or multiple rows at the same time.
- An "Edit All" button allows toggling edit mode for all rows.
- Each row has individual edit, save, and cancel buttons.
- "Save All" and "Cancel All" buttons are available when multiple rows are in edit mode.

### 2. Sorting

- Columns can be sortable by setting the `sortable` property in the column configuration.
- Clicking on the column header toggles sorting direction (ascending/descending).
- Sorting indicators (arrows) are displayed next to the column labels.
- Sorting does not trigger when interacting with filter input fields.

### 3. Filtering

- Columns can be filterable by setting the `filterable` property.
- Filter input fields appear below the column headers.
- Filtering updates the displayed rows dynamically.

### 4. Drag and Drop

- Rows and columns can be reordered via drag and drop if enabled in the configuration.

## Configuration

The component uses a `TableConfig` interface to define columns and features:

```typescript
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  type?: 'readonly' | 'text' | 'select';
  options?: { value: any; label: string }[];
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  addNewRowEnabled?: boolean;
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  dragDropRows?: boolean;
  dragDropColumns?: boolean;
  headerActionsTemplate?: TemplateRef<any>;
}
```

## Usage Example

In a component (e.g., ProductListComponent), import and configure the editable grid:

```typescript
import { TableConfig, TableColumn } from 'src/app/shared/components/table-column';

tableConfig: TableConfig<Product> = {
  columns: [
    { key: 'id', label: 'ID', type: 'readonly', sortable: true },
    { key: 'name', label: 'Name', type: 'text', sortable: true, filterable: true },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: 'Fruit', label: 'Fruit' },
        { value: 'Vegetable', label: 'Vegetable' },
        { value: 'Dairy', label: 'Dairy' },
      ],
      sortable: true,
      filterable: true,
    },
    { key: 'price', label: 'Price', type: 'text', sortable: true, filterable: true },
  ],
  addNewRowEnabled: true,
  editable: true,
  sortable: true,
  filterable: true,
  dragDropRows: true,
  dragDropColumns: true,
};
```

In the template:

```html
<app-reusable-table
  [config]="tableConfig"
  [data]="products"
  (dataChange)="onProductsChange($event)"
  (rowAdded)="onProductAdded($event)"
  (rowEdited)="onProductEdited($event)"
  (rowReordered)="onProductReordered($event)"
  (columnReordered)="onColumnReordered($event)">
</app-reusable-table>
```

## Events

- `dataChange`: Emits when the data array changes.
- `rowAdded`: Emits when a new row is added.
- `rowEdited`: Emits when a row is edited.
- `rowReordered`: Emits when rows are reordered.
- `columnReordered`: Emits when columns are reordered.

## Notes

- The component uses Angular Reactive Forms for editing rows.
- Sorting and filtering are applied on the client side.
- The component supports standalone usage and can be imported into any Angular module.

## Conclusion

This editable grid component provides a flexible and powerful way to display and manage tabular data with rich features. It can be easily configured and reused across different parts of the application.

For any questions or further customization, please refer to the source code in `src/app/shared/components/editable-table`.
