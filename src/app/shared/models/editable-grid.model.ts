import { Observable } from 'rxjs';
import { TableColumn, TableConfig } from '../editable-grid/table-column';

export interface EditableGridModel<T> {
    data: T[];                                 // the rows
    columns: TableColumn<T>[];                // your column definitions
    validators?: { [key: string]: any };       // optional per-field validators
    lastDeletedItemId$: Observable<number | null>;
    lastCreatedItem$: Observable<T | null>;
    config?: Partial<TableConfig<T>>;         // override any config flags
}