import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component} from '@angular/core';

interface Ingredient {
  id: string;
  name: string;
  image?: string;
}

@Component({
  selector: 'app-page-list-ingredient',
  templateUrl: './page-list-ingredient.component.html',
  styleUrl: './page-list-ingredient.component.css',
  standalone:false
})
export class PageListIngredientComponent {
    rigthIngredient: Ingredient[] = [
      { id: '1', name: 'Patates, tomate'},
      { id: '2', name: 'Plat #1'},
    ];
  
    leftIngredient: Ingredient[] = Array(10).fill(null).map((_, i) => ({
      id: `main-${i}`,
      name: 'Patates, tomate',
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
