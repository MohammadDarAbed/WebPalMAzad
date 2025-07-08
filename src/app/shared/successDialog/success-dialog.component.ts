import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog'; // ✅ Import the Material Dialog module

@Component({
  selector: 'app-success-dialog',
  standalone: true, // ✅ important if using standalone
  imports: [MatDialogModule], // ✅ include dialog module here
  templateUrl: './success-dialog.component.html'
})
export class SuccessDialogComponent {
  title = "✅ Success";
  content = "You have logged in successfully";
}
