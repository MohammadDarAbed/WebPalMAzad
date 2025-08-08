import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EditableGridComponent } from '../../../shared/editable-grid/editable-grid-component/editable-grid.component';
import { CategoryService } from '../services/category.service';
import { Category } from '../Models/category.model';
import { Observable, Subject } from 'rxjs';
import * as CategoryActions from '../store/category.actions';
import { select, Store } from '@ngrx/store';
import { selectAllCategories, selectLastCreatedCategoryId, selectLastDeletedCategoryId } from '../store/category.selectors';
import { EditableGridModel } from '../../../shared/models/editable-grid.model';
import { TableColumn, TableConfig } from '../../../shared/editable-grid/table-column';
import { CategoryGridConfig } from '../Models/CategoryGridConfig';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  imports: [CommonModule, EditableGridComponent]
})
export class CategoriesComponent implements OnInit {
  validators: { [key: string]: { validators: ValidatorFn[], messages?: { [key: string]: string } } } = {
    name: {
      validators: [Validators.required, Validators.maxLength(50)],
      messages: {
        required: "Name is required.",
        maxlength: "This field must be at most 50 characters.",
      }
    }
  }
  tableConfig: TableConfig<Category> = CategoryGridConfig();
  gridModel: EditableGridModel<Category> = {
    data: [],
    columns: this.tableConfig.columns,
    validators: this.validators,
    config: this.tableConfig,
    lastCreatedItem$: new Subject<Category>(),
    lastDeletedItemId$: new Subject<number>(),
  };
  categories$: Observable<Category[]> | undefined;
  categories: Category[] = [];
  constructor(private readonly store: Store) { }

  ngOnInit(): void {
    this.categories$ = this.store.select(selectAllCategories);
    this.store.dispatch(CategoryActions.loadCategories());
    this.categories$.subscribe((categories) => {
      this.categories = categories
      this.gridModel.data = categories.map((p, i) => ({ ...p, order: i + 1 }));
    });

    this.gridModel.lastDeletedItemId$ = this.store.pipe(
      select(selectLastDeletedCategoryId)
    );
    this.gridModel.lastCreatedItem$ = this.store.pipe(
      select(selectLastCreatedCategoryId)
    );

  }

  onCellValueChanged(event: { row: any; key: string; value: any }) {
    console.log("From onCellValueChanged");
  }


  onCategoryAdded(newCategory: any) {
    const category: Category = {
      id: 0,
      name: newCategory.name,
      isDeleted: false,
    };
    this.store.dispatch(CategoryActions.createCategory({ category }));
  }

  onCategoryDeleted(deletedCategory: Category) {
    this.store.dispatch(CategoryActions.deleteCategory({ id: deletedCategory.id }));
  }

  onCategoryEdited(event: { index: number; row: any }) {
    const category: Category = {
      id: event.row.id,
      name: event.row.name,
      isDeleted: event.row.isDeleted.value ?? false,
    };

    this.store.dispatch(CategoryActions.updateCategory({ category }));
  }

  onCategoryReordered(reordered: any) {
    console.log('Categorys reordered:', reordered);
  }

  onColumnReordered(newOrder: TableColumn<Category>[]) {
    console.log('Columns reordered:', newOrder);
  }
}
