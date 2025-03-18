import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithPopup } from '@angular/fire/auth'; 
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

const googleLogoURL = "https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";

@Component({
  selector: 'app-signUp',
  templateUrl: './signUp.component.html',
  styleUrls: ['./signUp.component.css'],
  standalone: false,
})
export class SignUpComponent implements OnInit {
  private auth = inject(Auth);
  
  // Déclaration du provider Google
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

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router:Router
  ) {
    this.matIconRegistry.addSvgIcon(
      "logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL)
    );
  }

  ngOnInit() {
    // Récupération du résultat après la redirection
    getRedirectResult(this.auth)
      .then((result) => {
        if (result) {
          const user = result.user;
          console.log('Inscription avec Google réussie :', result.user);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Erreur avec l\'authentification Google :', errorCode, errorMessage);
      });
  }

  submit() {
    if (this.form.valid) {
      this.inscription();
    }
  }

  public inscription() {
    const { email, password } = this.form.value;

    if (email && password) {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          console.log('Inscription réussie :', userCredential.user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Erreur de connexion :', errorCode, errorMessage);
        });
    }
  }

  // Méthode pour l'authentification via Google
  public signUpWithGoogle() {
    signInWithPopup(this.auth, this.googleProvider).then(()=>this.router.navigate(['main']));
  
  }
}
