import { TableConfig } from "../../../shared/editable-grid/table-column";
import { Product } from "./product.model";


export function ProductGridConfig() {
  return {
    columns: [
      { key: 'id', label: 'ID', type: 'readonly', sortable: true },
      { key: 'name', label: 'Name', type: 'text', sortable: true, filterable: true },
      { key: 'price', label: 'Price', type: 'text', sortable: true, filterable: true },
      { key: 'description', label: 'Description', type: 'text' },
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
    ],
    addNewRowEnabled: true,
    editable: true,
    sortable: false,
    filterable: true,
    dragDropRows: true,
    dragDropColumns: true,
  } as TableConfig<Product>;
}
