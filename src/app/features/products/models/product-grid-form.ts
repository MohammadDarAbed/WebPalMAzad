import { EditableGridCellType, TableConfig } from "../../../shared/editable-grid/table-column";
import { Product } from "./product.model";


export function ProductGridConfig() {
  return {
    columns: [
      { key: 'id', label: 'ID', type: EditableGridCellType.readonly, sortable: true, width: 30 },
      { key: 'name', label: 'Name', type: EditableGridCellType.text, sortable: true, filterable: true, width: 120 },
      { key: 'price', label: 'Price', type: EditableGridCellType.text, sortable: true, filterable: true, width: 120 },
      { key: 'description', label: 'Description', type: EditableGridCellType.text, width: 240 },
      { key: 'productQR', label: 'Product QR', type: EditableGridCellType.text, width: 120 },
      {
        key: 'category',
        label: 'Category',
        type: EditableGridCellType.select,
        options: [
          { value: 'Fruit', label: 'Fruit' },
          { value: 'Vegetable', label: 'Vegetable' },
          { value: 'Dairy', label: 'Dairy' },
        ],
        sortable: true,
        filterable: true,
        width: 120        
      },
    ],
    addNewRowEnabled: true,
    editable: true,
    readOnly: false,
    filterable: true,
    dragDropRows: true,
    dragDropColumns: true,
    useDialogToDelete: true,
    actionsColumnWidth: 120
  } as TableConfig<Product>;
}
