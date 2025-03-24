import { Component, Inject, Input, OnInit } from '@angular/core';
import { Meal } from '../../models/meal.model';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FavoriteRecipesService } from '../../service/favorite-recipes.service';

@Component({
  selector: 'description',
  templateUrl: './description.html',
  styleUrls: ['./description.css'],
  standalone: false,
})

export class DescriptionComponent implements OnInit {
  @Input() recipe!: Meal;
  @Input() displayType: 'sidebar' | 'main' = 'main';

  isFavorited: boolean = true; 

  constructor(
    private apiService: ApiService,
    private favoriteService: FavoriteRecipesService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string } | null
    
  ) {}



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

  ngOnInit(): void {
    if (!this.recipe && this.data?.id) {
      // Si la recette n'est pas passée en Input, on récupère via l'API
      this.apiService.getMealById(this.data.id).subscribe((meal) => {
        this.recipe = meal;
      });
    }
  }
  ngAfterViewInit(): void {
  // Forcer le focus sur le titre de la recette
  setTimeout(() => {
    const title = document.getElementById('mealName');
    if (title) {
      // Ajouter tabindex si nécessaire pour permettre le focus
      title.setAttribute('tabindex', '-1');
      title.focus();
      // Retirer le tabindex après avoir forcé le focus
      title.removeAttribute('tabindex');
    }
  }, 100);
}
}