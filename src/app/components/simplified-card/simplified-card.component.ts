import { Component, Input } from '@angular/core';
import { Meal } from '../../models/meal.model';

@Component({
  selector: 'app-simplified-card',
  standalone: false,
  templateUrl: './simplified-card.component.html',
  styleUrls: ['./simplified-card.component.css'], 
})
export class SimplifiedCardComponent {
  @Input() recipe!: Meal;
  @Input() displayType: 'sidebar' | 'main' = 'main';
  
  isFavorited: boolean = false; 

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.isFavorited = !this.isFavorited;
  }
}
