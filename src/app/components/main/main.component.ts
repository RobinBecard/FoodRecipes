import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { IngredientsList, Meal } from '../../models/meal.model';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: false,
})
export class MainComponent implements OnInit {
  // Listes
  RecipesList: Meal[] = []; // Liste de recettes filtrées
  favoriteRecipesList: Meal[] = []; // Liste des recettes favorites : à récupérer et sauvegarder avec firebase

  categories: string[] = [];
  regions: string[] = [];
  ingredientsList: IngredientsList[] = [];

  // Options de filtrage
  searchControl = new FormControl(''); // pour la recherche
  selectedCategory = new FormControl(''); // pour les catégories
  selectedRegion = new FormControl(''); // pour les régions
  selectedIngredientsList = new FormControl(''); // pour les listes d'ingrédients
  selectedLetter = new FormControl(''); // pour les lettres

  isLoading = false;
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(private mealService: ApiService) {} // pour les appels API

  ngOnInit(): void {
    this.loadInitialData(); // Charger les données initiales : catégories, régions, Liste d'ingrédients, recettes aléatoires, recettes favorites

    // Configurer la recherche
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        if (term && term.length > 1) {
          this.searchMeals(term);
        } else if (!term) {
          this.resetFilters();
        }
      });

    // Observer les changements de catégories, de régions, de lettres
    this.observeChanges(
      this.selectedCategory,
      this.filterByCategory.bind(this)
    );
    this.observeChanges(this.selectedRegion, this.filterByRegion.bind(this));
    this.observeChanges(
      this.selectedLetter,
      this.filterByFirstLetter.bind(this)
    );
  }

  loadInitialData(): void {
    this.isLoading = true;

    // Charger les catégories
    this.mealService.getAllMealCategories().subscribe((categories) => {
      this.categories = categories.map((cat) => cat.strCategory);
    });

    // Charger les régions
    this.mealService.getAllAreas().subscribe((areas) => {
      this.regions = areas;
    });

    // Charger les liste d'ingrédients
    // Temporairement : charger des ingédients aléatoire | dans l'attente d'une syncronisation avec firebase
    this.loadIngredientsList();

    // Temporairement : charger des recettes aléatoire
    // A FAIRE : se baser sur la liste d'ingrédients selectionnée pour proposer des reco
    this.loadRandomMeals(15);

    // Simuler des recettes favorites/liste (à remplacer par votre logique)
    this.loadSavedRecipes();
  }

  loadIngredientsList(): void {
    this.mealService.getAllIngredients().subscribe((ingredients) => {
      const tempIngredients: string[] = ingredients.map(
        (ingredient) => ingredient.strIngredient
      );

      const randomIngredients = [];
      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * tempIngredients.length);
        randomIngredients.push(tempIngredients[randomIndex]);
        tempIngredients.splice(randomIndex, 1);
      }

      const tempIngredientsList: IngredientsList[] = [
        {
          listName: 'Random Ingredients',
          ingredients: randomIngredients,
        },
      ];

      this.ingredientsList = tempIngredientsList;
    });
  }

  loadRandomMeals(count: number): void {
    this.isLoading = true;
    // s'assurer que les listes sont vides
    this.RecipesList = [];

    for (let i = 0; i < count; i++) {
      this.mealService.getSingleRandomMeal().subscribe((meal) => {
        this.RecipesList.push(meal); // ajouter les recettes à la liste filtrée | il faudrait prendre les recettes en communes, et non l'union des recettes filtrés
        this.isLoading = false;
      });
    }
  }

  loadSavedRecipes(): void {
    // Simuler le chargement des recettes sauvegardées
    // Faire une requête à Firebase pour récupérer les recettes favorites
    this.mealService.getMealById('52771').subscribe((meal) => {
      this.favoriteRecipesList = [meal];
    });

    this.mealService.getMealById('52772').subscribe((meal) => {
      this.favoriteRecipesList.push(meal);
    });
  }

  searchMeals(term: string): void {
    this.isLoading = true;
    this.mealService.getMealByName(term).subscribe((meals) => {
      if (meals) {
        this.RecipesList = meals; // remplace la liste par la rechercher
      } else {
        this.RecipesList = []; // pas de recettes trouvées
      }
      this.isLoading = false;
    });
  }

  filterByCategory(category: string): void {
    this.isLoading = true;
    this.mealService
      .getAllMealsFilterByCategory(category)
      .subscribe((meals) => {
        this.RecipesList = meals;
        this.isLoading = false;
      });
  }

  filterByRegion(region: string): void {
    this.isLoading = true;
    this.mealService.getAllMealsFilterByArea(region).subscribe((meals) => {
      this.RecipesList = meals;
      this.isLoading = false;
    });
  }

  filterByFirstLetter(letter: string): void {
    this.isLoading = true;
    this.mealService.getAllMealsByFirstLetter(letter).subscribe((meals) => {
      this.RecipesList = meals;
      this.isLoading = false;
    });
  }

  resetFilters(): void {
    this.selectedCategory.setValue('');
    this.selectedRegion.setValue('');
    this.selectedIngredientsList.setValue('');
    this.selectedLetter.setValue('');
    this.searchControl.setValue('');
    this.loadRandomMeals(15);
  }

  drop(event: CdkDragDrop<Meal[]>) {
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

  addToFavorites(recipe: Meal): void {
    if (!this.favoriteRecipesList.some((r) => r.idMeal === recipe.idMeal)) {
      this.favoriteRecipesList.push(recipe);
    }
  }

  removeFromFavorites(recipe: Meal): void {
    this.favoriteRecipesList = this.favoriteRecipesList.filter(
      (r) => r.idMeal !== recipe.idMeal
    );
  }

  private observeChanges(
    control: FormControl,
    filterFunction: (value: string) => void
  ): void {
    control.valueChanges.subscribe((value) => {
      if (value) {
        filterFunction(value);
      }
    });
  }
}
