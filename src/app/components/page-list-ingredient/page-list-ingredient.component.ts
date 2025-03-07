import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component} from '@angular/core';

interface Ingredient {
  id: string;
  name: string;
  calories: number;
  image?: string;
}

@Component({
  selector: 'app-page-list-ingredient',
  templateUrl: './page-list-ingredient.component.html',
  styleUrl: './page-list-ingredient.component.css'
})
export class PageListIngredientComponent {
  rigthIngredient: Ingredient[] = [
      { id: '1', name: 'Patates, tomate', calories: 544 },
      { id: '2', name: 'Plat #1', calories: 450 },
    ];
  
    mainRecipes: Ingredient[] = Array(10).fill(null).map((_, i) => ({
      id: `main-${i}`,
      name: 'Patates, tomate',
      calories: 544
    }));
  
    drop(event: CdkDragDrop<Ingredient[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
    }
}
