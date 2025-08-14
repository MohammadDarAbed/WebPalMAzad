import {
    EditableGridCellType,
    TableConfig,
    textcolumnPosition
} from "../../../shared/editable-grid/table-column";
import { Order } from "./order.mdel";

export function OrderGridConfig() {
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
                key: 'totalAmount',
                label: 'Total Amount',
                type: EditableGridCellType.readonly,
                sortable: true,
                filterable: true,
                width: 120,
                textPosition: textcolumnPosition.Center
            },
            {
                key: 'status',
                label: 'Status',
                type: EditableGridCellType.readonly,
                sortable: true,
                filterable: true,
                width: 120,
                textPosition: textcolumnPosition.Center
            },
            {
                key: 'buyer',
                label: 'Buyer',
                previewKey: 'buyer.name',
                valueKey: 'id',
                labelKey: 'name',
                options: [],
                type: EditableGridCellType.select,
                sortable: true,
                filterable: true,
                width: 120,
                textPosition: textcolumnPosition.Center,
                placeholder: "Select...",
            },
            {
                key: 'notes',
                label: 'Notes',
                type: EditableGridCellType.text,
                sortable: true,
                filterable: true,
                width: 120,
                textPosition: textcolumnPosition.Center
            },
            {
                key: 'address',
                label: 'Address',
                type: EditableGridCellType.text,
                sortable: true,
                filterable: true,
                width: 120,
                textPosition: textcolumnPosition.Center,
            },
            {
                key: 'orderDate',
                label: 'Order Date',
                type: EditableGridCellType.readonly,
                sortable: true,
                filterable: true,
                width: 120,
                textPosition: textcolumnPosition.Center
            },
            {
                key: 'items',
                label: 'Items',
                type: EditableGridCellType.openNew,
                sortable: true,
                filterable: true,
                width: 120,
                textPosition: textcolumnPosition.Center,
                openNewTapIconDisabled: false
            },

        ],
        addNewRowEnabled: true,
        editable: true,
        readonly: false,
        filterable: true,
        dragDropRows: true,
        dragDropColumns: true,
        useDialogToDelete: false,
        actionsColumnWidth: 120,
        textPosition: textcolumnPosition.Center
    } as TableConfig<Order>;
}
