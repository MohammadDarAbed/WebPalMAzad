import { EditableGridCellType, TableConfig } from "../../../shared/editable-grid/table-column";
import { Product } from "./product.model";

export enum CategoryEnum {
  Other = 1,
  Vhecle = 2,
  Food = 3,
  Device = 4,
  Land = 5,
  Clothe = 6
}

export function ProductGridConfig() {
  return {
    columns: [
      { key: 'id', label: 'ID', type: EditableGridCellType.readonly, sortable: true, width: 30 },
      { key: 'name', label: 'Name', type: EditableGridCellType.text, sortable: true, filterable: true, width: 120 },
      { key: 'price', label: 'Price', type: EditableGridCellType.text, sortable: true, filterable: true, width: 120 },
      { key: 'description', label: 'Description', type: EditableGridCellType.text, width: 240 },
      { key: 'productQR', label: 'Product QR', type: EditableGridCellType.text, width: 120 },
      {
        key: 'categoryId',
        label: 'Category',
        type: EditableGridCellType.select,
        options: [
          { value: CategoryEnum.Other, label: 'Other' },
          { value: CategoryEnum.Vhecle, label: 'Vhecle' },
          { value: CategoryEnum.Food, label: 'Food' },
          { value: CategoryEnum.Device, label: 'Device' },
          { value: CategoryEnum.Land, label: 'Land' },
          { value: CategoryEnum.Clothe, label: 'Clothe' },
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
    useDialogToDelete: false,
    actionsColumnWidth: 120
  } as TableConfig<Product>;
}
