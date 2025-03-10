import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Recipe } from '../../models/meal.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: false,
})
export class MainComponent {
  sidebarRecipes: Recipe[] = [
    { idMeal: '1', strMeal: 'Patates, tomate', strCategory: 'Asian' },
    { idMeal: '2', strMeal: 'Plat #1', strCategory: 'French' },
  ];

  mainRecipes: Recipe[] = Array(10)
    .fill(null)
    .map((_, i) => ({
      idMeal: `main-${i}`,
      strMeal: 'Patates, tomate',
      strCategory: 'Asian',
    }));

  drop(event: CdkDragDrop<Recipe[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
