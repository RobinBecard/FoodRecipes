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

  constructor(
    private dialogRef: MatDialogRef<ProfilePopupComponent>,
    private auth: Auth
  ) {
    this.userEmail = auth.currentUser?.email || null;
  }

  toggleChangePassword() {
    this.showChangePassword = !this.showChangePassword;
    this.showChangeEmail = false;
  }

  toggleChangeEmail() {
    this.showChangeEmail = !this.showChangeEmail;
    this.showChangePassword = false;
  }

  changePassword() {
    const email = this.emailControl.value;

    if (!email) {
      this.loginError = 'Veuillez entrer votre adresse e-mail.';
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
      this.emailError = 'Veuillez entrer un nouvel e-mail valide.';
      return;
    }

    if (!user) {
      this.emailError = 'Aucun utilisateur connecté.';
      return;
    }

    updateEmail(user, newEmail)
      .then(() => {
        this.userEmail = newEmail;
        alert('Adresse e-mail mise à jour avec succès !');
      })
      .catch((error) => {
        console.error('Erreur :', error.code, error.message);
        this.handleEmailError(error.code);
      });
  }

  handleError(errorCode: string) {
    this.loginError =
      errorCode === 'auth/user-not-found'
        ? 'Aucun utilisateur trouvé avec cet e-mail.'
        : 'Une erreur est survenue.';
  }

  handleEmailError(errorCode: string) {
    this.emailError =
      errorCode === 'auth/requires-recent-login'
        ? 'Veuillez vous reconnecter avant de changer votre e-mail.'
        : 'Impossible de modifier l’e-mail.';
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
