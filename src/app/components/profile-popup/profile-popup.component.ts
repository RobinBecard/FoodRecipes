import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-popup',
  templateUrl: './profile-popup.component.html',
  styleUrls: ['./profile-popup.component.css']

})
export class ProfilePopupComponent {
  constructor(private dialogRef: MatDialogRef<ProfilePopupComponent>) {}

  changeEmail() {
    console.log('Changer email - à implémenter');
  }

  changePassword() {
    console.log('Changer mot de passe - à implémenter');
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
