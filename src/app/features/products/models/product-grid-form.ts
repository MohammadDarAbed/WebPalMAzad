import { EditableGridCellType, TableConfig } from "../../../shared/editable-grid/table-column";
import { Product } from "./product.model";

export function ProductGridConfig() {
  return {
    columns: [
      { key: 'order', label: 'Order', type: EditableGridCellType.readonly, sortable: true, width: 30 },
      // { key: 'id', label: 'ID', type: EditableGridCellType.readonly, sortable: true, width: 30 },
      { key: 'name', label: 'Name', type: EditableGridCellType.text, sortable: true, filterable: true, width: 120 },
      { key: 'price', label: 'Price', type: EditableGridCellType.number, sortable: true, filterable: true, width: 120 },
      { key: 'description', label: 'Description', type: EditableGridCellType.text, width: 240 },
      { key: 'productQR', label: 'Product QR', type: EditableGridCellType.readonly, width: 120 },
      {
        key: 'seller', label: 'Seller', type: EditableGridCellType.select, width: 120, placeholder: "Select...",
        previewKey: 'seller.name', valueKey: 'sellerId',
        options: [
          { value: 1, label: 'System' },
        ]
      },
      {
        key: 'condition', label: 'Condition', type: EditableGridCellType.select, width: 120, placeholder: "Select...",
        valueKey: 'condition',
        options: [
          { value: 1, label: 'New' },
          { value: 2, label: 'Used' },
          { value: 3, label: 'Service' }
        ]
      },
      {
        key: 'isHiddenSellerInfo', label: 'Hidden Seller', type: EditableGridCellType.select, width: 120, placeholder: "Select...",
        valueKey: 'isHiddenSellerInfo',
        options: [
          { value: false, label: 'False' },
          { value: true, label: 'True' }
        ]
      },
      {
        key: 'isPublished', label: 'Published', type: EditableGridCellType.select, width: 120, placeholder: "Select...",
        valueKey: 'isPublished',
        options: [
          { value: false, label: 'False' },
          { value: true, label: 'True' }
        ]
      },
      {
        key: 'category',
        label: 'Category',
        previewKey: 'category.name',
        valueKey: 'categoryId',
        type: EditableGridCellType.select,
        placeholder: "Select...",
        options: [],
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
    useDialogToDelete: false,
    actionsColumnWidth: 120
  } as TableConfig<Product>;
}
