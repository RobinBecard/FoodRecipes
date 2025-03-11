import { Component, OnInit, inject } from '@angular/core';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { Meal } from '../../models/meal.model';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'], // Correction : styleUrl → styleUrls
  standalone: false,
})
export class BodyComponent implements OnInit {
  private auth = inject(Auth);
  public myMeal?: Meal;
  public userEmail?: string; // Stocke l'email de l'utilisateur

  constructor(private api: ApiService) {}

  ngOnInit() {
    // Récupérer l'email de l'utilisateur connecté
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.userEmail = user.email ?? 'Email non disponible';
        console.log('Utilisateur connecté :', this.userEmail);
      } else {
        console.log('Aucun utilisateur connecté.');
      }
    });

    // Charger le repas
    this.api.getMealById('52772').subscribe((meal: Meal) => {
      console.log('ça marche');
      this.myMeal = meal;
    });
  }

  onLogOut() {
    console.log('L’utilisateur est déconnecté.');
  }
}
