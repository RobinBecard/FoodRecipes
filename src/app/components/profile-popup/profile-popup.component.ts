import { Component } from '@angular/core';
import { Auth, sendPasswordResetEmail, updateEmail } from '@angular/fire/auth';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-popup',
  templateUrl: './profile-popup.component.html',
  styleUrls: ['./profile-popup.component.css'],
  standalone: false,
})
export class ProfilePopupComponent {
  userEmail: string | null = null;
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  newEmailControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  loginError: string | null = null;
  emailError: string | null = null;
  showChangePassword = false;
  showChangeEmail = false;
  activeButton: 'email' | 'password' | null = null;

  constructor(
    private dialogRef: MatDialogRef<ProfilePopupComponent>,
    private auth: Auth
  ) {
    this.userEmail = auth.currentUser?.email || null;
  }

  toggleChangePassword() {
    this.showChangePassword = !this.showChangePassword;
    this.showChangeEmail = false;
    this.activeButton = this.activeButton === 'password' ? null : 'password';
  }

  toggleChangeEmail() {
    this.showChangeEmail = !this.showChangeEmail;
    this.showChangePassword = false;
    this.activeButton = this.activeButton === 'email' ? null : 'email';
  }

  isButtonActive(type: 'email' | 'password'): boolean {
    return this.activeButton === type;
  }

  changePassword() {
    const email = this.emailControl.value;
  
    if (!email) {
      this.loginError = 'Please enter your email address.';
      return;
    }
  

  sendPasswordResetEmail(this.auth, email)
      .then(() => {
        alert('Un e-mail de réinitialisation a été envoyé à ' + email);
      })
      .catch((error) => {
        console.error('Erreur :', error.code, error.message);
        this.handleError(error.code);
      });

    }


  changeEmail() {
    const newEmail = this.newEmailControl.value;
    const user = this.auth.currentUser;

    if (!newEmail) {
      this.emailError = 'Please enter a valid email address.';
      return;
    }

    if (!user) {
      this.emailError = 'No user is currently logged in.';
      return;
    }

    updateEmail(user, newEmail)
      .then(() => {
        this.userEmail = newEmail;
        alert('Email address updated successfully!');
      })
      .catch((error) => {
        console.error('Error:', error.code, error.message);
        this.handleEmailError(error.code);
      });
  }

  handleError(errorCode: string) {
    this.loginError =
      errorCode === 'auth/user-not-found'
        ? 'No user found with this email.'
        : 'An error occurred.';
  }

  handleEmailError(errorCode: string) {
    this.emailError =
      errorCode === 'auth/requires-recent-login'
        ? 'Please log in again before changing your email.'
        : 'Unable to modify email.';
  }

  closeDialog() {
    this.dialogRef.close();
    this.activeButton = null;
  }
}