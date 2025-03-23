import { Component } from '@angular/core';
import { Auth, signInWithPhoneNumber, RecaptchaVerifier, signInWithCredential, PhoneAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.css'],
  standalone: false,
})
export class PhoneLoginComponent {
  phoneNumber: string = '';
  otpCode: string = '';
  verificationId: string = '';
  recaptchaVerifier!: RecaptchaVerifier;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
      size: 'invisible' 
    });
  }

  sendOtp() {
    if (!this.phoneNumber.startsWith('+')) {
      alert("Ajoute l'indicatif du pays (ex: +33 pour la France)");
      return;
    }

    signInWithPhoneNumber(this.auth, this.phoneNumber, this.recaptchaVerifier)
      .then(confirmationResult => {
        this.verificationId = confirmationResult.verificationId;
        alert('OTP envoyé ! Vérifie ton téléphone.');
      })
      .catch(error => {
        console.error('Erreur OTP:', error);
      });
  }

  verifyOtp() {
    if (this.verificationId) {
      const credential = PhoneAuthProvider.credential(this.verificationId, this.otpCode);

      signInWithCredential(this.auth, credential)
        .then(() => {
          alert('Connexion réussie !');
          this.router.navigate(['/']); 
        })
        .catch(error => {
          console.error('Erreur de vérification:', error);
        });
    } else {
      alert("Veuillez d'abord envoyer l'OTP.");
    }
  }
}
