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
                key: 'order', label: 'Order',
                type: EditableGridCellType.readonly,
                sortable: true, width: 30,
                textPosition: textcolumnPosition.Center,
                textSize: 16
            },
            {
                key: 'totalAmount', label: 'Total Amount',
                type: EditableGridCellType.number,
                sortable: true, filterable: true, width: 120,
                textPosition: textcolumnPosition.Center
            },
            {
                key: 'status', label: 'Status',
                type: EditableGridCellType.text,
                sortable: true, filterable: true,
                width: 120,
                textPosition: textcolumnPosition.Center
            },
            {
                key: 'buyer', label: 'Buyer',
                type: EditableGridCellType.text,
                sortable: true, filterable: true,
                width: 120,
                textPosition: textcolumnPosition.Center,
                previewKey: 'buyer.name'
            },
            {
                key: 'notes', label: 'Notes',
                type: EditableGridCellType.text,
                sortable: true, filterable: true, width: 120,
                textPosition: textcolumnPosition.Center
            },
            {
                key: 'orderDate',
                label: 'Order Date',
                type: EditableGridCellType.date,
                sortable: true,
                filterable: true,
                width: 120,
                textPosition: textcolumnPosition.Center
            },
            // {
            //     key: 'items',
            //     label: 'Items',
            //     type: EditableGridCellType.date,
            //     sortable: true,
            //     filterable: true,
            //     width: 120,
            //     textPosition: textcolumnPosition.Center,
            //     previewKey: 'items'
            // },

        ],
        addNewRowEnabled: true,
        editable: true,
        readOnly: false,
        filterable: true,
        dragDropRows: true,
        dragDropColumns: true,
        useDialogToDelete: false,
        actionsColumnWidth: 120,
        textPosition: textcolumnPosition.Center
    } as TableConfig<Order>;
}
