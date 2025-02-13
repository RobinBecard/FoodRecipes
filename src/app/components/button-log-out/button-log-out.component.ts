import { Component, Output, EventEmitter, inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-button-log-out',
  templateUrl: './button-log-out.component.html',
  styleUrls: ['./button-log-out.component.css']
})
export class ButtonLogOutComponent {

  private auth = inject(Auth); // Injection du service Auth

  @Output() logoutEvent = new EventEmitter<void>(); // Événement pour informer un parent

  logOut() {
    signOut(this.auth)
      .then(() => {
        console.log('Déconnexion réussie');
        this.logoutEvent.emit(); // Émet un événement après déconnexion
      })
      .catch(error => {
        console.error('Erreur de déconnexion :', error);
      });
  }
}
