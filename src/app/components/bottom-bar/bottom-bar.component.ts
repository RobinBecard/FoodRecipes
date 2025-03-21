import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfilePopupComponent } from '../profile-popup/profile-popup.component';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.css'],
})
export class BottomBarComponent {
  constructor(public dialog: MatDialog) {}

  openProfilePopup(): void {
    this.dialog.open(ProfilePopupComponent, {
      width: '300px',
    });
  }
}
