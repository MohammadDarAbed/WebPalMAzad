import { BooleanOptions, EditableGridCellType, TableConfig, textcolumnPosition } from "../../../shared/editable-grid/table-column";
import { ProductConditionOptions } from "./condition.model";
import { Product } from "./product.model";

export function ProductGridConfig() {
  return {
    columns: [
      { key: 'order', label: 'Order', type: EditableGridCellType.readonly, sortable: true, width: 30, textPosition: textcolumnPosition.Center, textSize: 16 },
      { key: 'name', label: 'Name', type: EditableGridCellType.text, sortable: true, filterable: true, width: 120, textPosition: textcolumnPosition.Center },
      { key: 'price', label: 'Price', type: EditableGridCellType.number, sortable: true, filterable: true, width: 120, textPosition: textcolumnPosition.Center },
      { key: 'description', label: 'Description', type: EditableGridCellType.text, width: 240, textPosition: textcolumnPosition.Center },
      { key: 'productQR', label: 'Product QR', type: EditableGridCellType.text, width: 120, textPosition: textcolumnPosition.Center },
      {
        key: 'seller', label: 'Seller', type: EditableGridCellType.select, width: 120, textPosition: textcolumnPosition.Center, placeholder: "Select...",
        previewKey: 'seller.name',
        valueKey: 'id',
        options: [],
        labelKey: 'name',
      },
      {
        key: 'condition', label: 'Condition', type: EditableGridCellType.select, width: 120, textPosition: textcolumnPosition.Center, placeholder: "Select...",
        options: ProductConditionOptions,
        labelKey: 'name',
        previewKey: 'condition.name',
        valueKey: 'name',
      },
      {
        key: 'isHiddenSellerInfo', label: 'Hidden Seller', type: EditableGridCellType.select, width: 120, textPosition: textcolumnPosition.Center, placeholder: "Select...",
        options: BooleanOptions,
        valueKey: 'value',
        labelKey: 'label',
        previewKey: 'isHiddenSellerInfo.label'

      },
      {
        key: 'isPublished', label: 'Published', type: EditableGridCellType.select, width: 120, textPosition: textcolumnPosition.Center, placeholder: "Select...",
        options: BooleanOptions,
        valueKey: 'value',
        labelKey: 'label',
        previewKey: 'isPublished.label'

      },
      {
        key: 'category', // key to access on the column
        label: 'Category', // The column label
        previewKey: 'category.name', // View the slected value, (in the combobox that not object put the key)
        valueKey: 'id', // to access on the value to pass it in the model objects fields: item[this.valueField] and to pevire the selected in the edit mode (combobox-field.component.ts) 
        labelKey: 'name', // the fields that will be used to display the options value
        type: EditableGridCellType.select,
        placeholder: "Select...", // the placeholder of the selction field
        options: [], // options, static values or from API 
        sortable: true,
        filterable: true,
        width: 120, textPosition: textcolumnPosition.Center
      }
    ],
    addNewRowEnabled: true,
    editable: true,
    readOnly: false,
    filterable: true,
    dragDropRows: true,
    dragDropColumns: true,
    useDialogToDelete: false,
    actionsColumnWidth: 120, textPosition: textcolumnPosition.Center
  } as TableConfig<Product>;
}
