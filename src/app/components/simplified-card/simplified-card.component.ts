import { Component, Input, OnInit } from '@angular/core';
import { Meal } from '../../models/meal.model';
import { FavoriteRecipesService } from '../../service/favorite-recipes.service';

@Component({
  selector: 'app-simplified-card',
  standalone: false,
  templateUrl: './simplified-card.component.html',
  styleUrls: ['./simplified-card.component.css'], 
})
export class SimplifiedCardComponent implements OnInit {
  @Input() recipe!: Meal;
  @Input() displayType: 'sidebar' | 'main' = 'main';
  
  isFavorited: boolean = false; 

  constructor(private favoriteService: FavoriteRecipesService) {}

  async ngOnInit(): Promise<void> {
    if (this.recipe && this.recipe.idMeal) {
      try {
        const favorited = await this.favoriteService.checkRecipeFavorited(this.recipe.idMeal);
        this.isFavorited = favorited;
        console.log(`Recipe ${this.recipe.idMeal} favorited status:`, favorited);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    }
  }  

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    
    if (!this.recipe || !this.recipe.idMeal) {
      console.error('Cannot toggle favorite: Invalid recipe');
      return;
    }
    
    this.favoriteService.toggleFavorite(this.recipe)
      .subscribe({
        next: (isFavorited) => {
          console.log('Favorite toggled, new status:', isFavorited);
          this.isFavorited = isFavorited;
        },
        error: (error) => {
          console.error('Error toggling favorite:', error);
        }
      });
  }

  getMatchScoreColor(): string {
    if (!this.recipe.matchScore) return '';

    if (this.recipe.matchScore < 40) {
      return 'match-score-low';
    } else if (this.recipe.matchScore < 70) {
      return 'match-score-medium';
    } else {
      return 'match-score-high';
    }
  }
}