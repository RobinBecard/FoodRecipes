import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'app-signUp',
    templateUrl: './signUp.component.html',
    styleUrl: './signUp.component.css',
    standalone: false
})
export class SignUpComponent {

  private auth = inject(Auth);

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  @Input() error: string | null | undefined;
  @Output() submitEM = new EventEmitter();
  
  submit() {
    if (this.form.valid) {
      this.inscription();
    }
  }

  public inscription(){
    const { email, password } = this.form.value; // Récupération des valeurs du formulaire

    if (email && password){
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
}

