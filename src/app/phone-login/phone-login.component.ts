import { Component } from '@angular/core';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.css'],
  standalone: false,
})
export class PhoneLoginComponent {
  phoneNumber: string = '';
  otpCode: string = '';

  sendOtp() {
    console.log("OTP envoyé à :", this.phoneNumber);
  }

  verifyOtp() {
    console.log("Vérification OTP :", this.otpCode);
  }
}
