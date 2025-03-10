import { Component } from '@angular/core';
import { Meal } from '../../models/meal.model';

@Component({
  selector: 'app-meal-card',
  standalone: false,
  templateUrl: './meal-card.component.html',
  styleUrl: './meal-card.component.css',
})
export class MealCardComponent {
  sidebarRecipes: Meal[] = getMealBy;

  mainRecipes: Meal[] = Array(10)
    .fill(null)
    .map((_, i) => ({
      id: `main-${i}`,
      name: 'Patates, tomate',
      calories: 544,
    }));
}
