import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';


const materialModules = [
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatCardModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [...materialModules]
})
export class MaterialModule { }
