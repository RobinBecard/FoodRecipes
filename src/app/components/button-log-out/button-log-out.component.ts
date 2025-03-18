import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'button-log-out',
  templateUrl: './button-log-out.component.html',
  styleUrls: ['./button-log-out.component.css'],
  standalone: false,
})
export class ButtonLogOutComponent {
  private auth = inject(Auth); // Injection du service Auth
  private router = inject(Router); // Injection du service Router

  @Output() logoutEvent = new EventEmitter<void>(); // Événement pour informer un parent

  logOut() {
    signOut(this.auth)
      .then(() => {
        console.log('Déconnexion réussie');
        this.logoutEvent.emit(); // Émet un événement après déconnexion
        this.router.navigate(['']);
      })
      .catch((error) => {
        console.error('Erreur de déconnexion :', error);
      });
  }
}
