import { EditableGridCellType, TableConfig, TableMode, textcolumnPosition } from "../../../../shared/editable-grid/table-column";
import { OrderItem } from "../../models/order.mdel";

export function OrderItemsGridConfig() {
    return {
        columns: [
            {
                key: 'order',
                label: 'Order',
                type: EditableGridCellType.readonly,
                sortable: true,
                width: 30,
                textPosition: textcolumnPosition.Center,
                textSize: 16
            },
            {
                key: 'quantity',
                label: 'Quantity',
                type: EditableGridCellType.number,
                sortable: true,
                filterable: true,
                width: 120,
                textPosition: textcolumnPosition.Center
            },
            {
                key: 'product',
                label: 'Product',
                type: EditableGridCellType.comboBox,
                sortable: true,
                filterable: true,
                width: 120,
                textPosition: textcolumnPosition.Center,
                options: [],
                previewKey: 'product.name',
                valueKey: 'id',
                labelKey: 'name',

            },
            {
                key: 'price',
                label: 'Price',
                type: EditableGridCellType.readonly,
                sortable: true,
                filterable: true,
                width: 120,
                textPosition: textcolumnPosition.Center
            }
        ],
        addNewRowEnabled: true,
        editable: true,
        readonly: false,
        filterable: true,
        dragDropRows: true,
        dragDropColumns: true,
        useDialogToDelete: false,
        actionsColumnWidth: 120,
    } as TableConfig<OrderItem>;
}
