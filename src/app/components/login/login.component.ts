import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: false,
})
export class LoginComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  @Input() error: string | null | undefined;
  @Output() submitEM = new EventEmitter();

  loginError: string | null = null; // Stockage du message d'erreur

  submit() {
    if (this.form.valid) {
      this.logIn();
    }
  }

  logIn() {
    const { email, password } = this.form.value;

    if (email && password) {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          console.log('Connexion réussie :', userCredential.user);
          this.loginError = null; // Réinitialiser l'erreur en cas de succès
          this.router.navigate(['main']);
        })
        .catch((error) => {
          console.error('Erreur de connexion :', error.code, error.message);
          this.handleError(error.code);
        });
    }
  }

  handleError(errorCode: string) {
    switch (errorCode) {
      case 'auth/invalid-email':
        this.loginError = "L'adresse e-mail est invalide.";
        break;
      case 'auth/user-disabled':
        this.loginError = 'Ce compte a été désactivé.';
        break;
      case 'auth/user-not-found':
        this.loginError = 'Aucun utilisateur trouvé avec cet e-mail.';
        break;
      case 'auth/wrong-password':
        this.loginError = 'Mot de passe incorrect.';
        break;
      default:
        this.loginError = 'Une erreur est survenue. Veuillez réessayer.';
    }
  }
}
