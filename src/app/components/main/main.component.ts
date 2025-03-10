import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

interface Recipe {
  id: string;
  name: string;
  calories: number;
  image?: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: false,
})
export class MainComponent {
  sidebarRecipes: Recipe[] = [
    { id: '1', name: 'Patates, tomate', calories: 544 },
    { id: '2', name: 'Plat #1', calories: 450 },
  ];

  mainRecipes: Recipe[] = Array(10)
    .fill(null)
    .map((_, i) => ({
      id: `main-${i}`,
      name: 'Patates, tomate',
      calories: 544,
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
