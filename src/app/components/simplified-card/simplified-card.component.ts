import { Component, Input } from '@angular/core';
import { Meal } from '../../models/meal.model';

@Component({
  selector: 'app-simplified-card',
  standalone: false,
  templateUrl: './simplified-card.component.html',
  styleUrl: './simplified-card.component.css',
})
export class SimplifiedCardComponent {
  // Rappel : @input permet de passer des données à un composant
  @Input() recipe!: Meal;
  @Input() displayType: 'sidebar' | 'main' = 'main';
}
