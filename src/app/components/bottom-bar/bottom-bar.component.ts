import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfilePopupComponent } from '../profile-popup/profile-popup.component';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrl: './bottom-bar.component.css',
  standalone: false,
})
export class BottomBarComponent {
  constructor(public dialog: MatDialog) {}

  openProfilePopup(): void {
    this.dialog.open(ProfilePopupComponent, {
      width: '300px',
    });
  }
}
