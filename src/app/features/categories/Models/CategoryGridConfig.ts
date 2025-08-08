import { EditableGridCellType, TableConfig, textcolumnPosition } from "../../../shared/editable-grid/table-column";
import { Category } from "./category.model";

export function CategoryGridConfig() {
    return {
        columns: [
            { key: 'order', label: 'Order', type: EditableGridCellType.readonly, sortable: true, width: 30, textPosition: textcolumnPosition.Center, textSize: 16 },
            { key: 'name', label: 'Name', type: EditableGridCellType.text, sortable: true, filterable: true, width: 120, textPosition: textcolumnPosition.Center },

        ],
        addNewRowEnabled: true,
        editable: true,
        readOnly: false,
        filterable: true,
        dragDropRows: true,
        dragDropColumns: true,
        useDialogToDelete: false,
        actionsColumnWidth: 120, textPosition: textcolumnPosition.Center
    } as TableConfig<Category>;
}
