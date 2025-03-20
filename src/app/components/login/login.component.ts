import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, getRedirectResult } from '@angular/fire/auth';
import { Router } from '@angular/router';

const googleLogoURL = "https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private googleProvider = new GoogleAuthProvider();

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

  ngOnInit() {
    getRedirectResult(this.auth)
      .then((result) => {
        if (result) {
          console.log('Connexion avec Google réussie :', result.user);
          this.router.navigate(['main']);
        }
      })
      .catch((error) => {
        console.error('Erreur avec l\'authentification Google :', error.code, error.message);
      });
  }

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
          this.loginError = null;
          this.router.navigate(['main']);
        })
        .catch((error) => {
          console.error('Erreur de connexion :', error.code, error.message);
          this.handleError(error.code);
        });
    }
  }

  signInWithGoogle() {
    signInWithPopup(this.auth, this.googleProvider)
      .then(() => {
        console.log('Connexion avec Google réussie');
        this.router.navigate(['main']);
      })
      .catch((error) => {
        console.error('Erreur lors de la connexion avec Google :', error.code, error.message);
      });
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
