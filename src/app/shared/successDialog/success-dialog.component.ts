import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './success-dialog.component.html'
})
export class SuccessDialogComponent {
  title = "✅ Success";
  content = "You have logged in successfully";
}
