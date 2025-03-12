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
  mainRecipes: Meal[] = []; // Liste de recettes principales
  filteredRecipes: Meal[] = []; // Liste de recettes filtrées
  favoriteRecipes: Meal[] = []; // Liste des recettes favorites : à récupérer et sauvegarder avec firebase

  // Options de filtrage
  categories: string[] = [];
  regions: string[] = [];
  ingredientsList: IngredientsList[] = [];

  // Contrôles pour la recherche et le filtrage
  searchControl = new FormControl('');
  selectedCategory = new FormControl('');
  selectedRegion = new FormControl('');
  selectedIngredientsList = new FormControl<IngredientsList>({
    listName: '',
    ingredients: [''],
  });
  selectedLetter = new FormControl('');

  // État des filtres
  isLoading = false;
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // afficher toutes les lettres de l'alphabet | peut-être emplacé par un simple input

  constructor(private mealService: ApiService) {} // pour les appels API

  // à l'initialisation
  ngOnInit(): void {
    this.loadInitialData(); // Charger les données initiales : catégories, régions, Liste d'ingrédients, recettes aléatoires, recettes favorites

    // Configurer la recherche
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        if (term && term.length > 2) {
          this.searchMeals(term);
        } else if (!term) {
          this.resetFilters();
        }
      });

    // Observer les changements de catégories
    this.selectedCategory.valueChanges.subscribe((category) => {
      if (category) {
        this.filterByCategory(category);
      }
    });

    // Observer les changements de régions
    this.selectedRegion.valueChanges.subscribe((region) => {
      if (region) {
        this.filterByRegion(region);
      }
    });

    // Observer les changements de lettre
    this.selectedLetter.valueChanges.subscribe((letter) => {
      if (letter) {
        this.filterByFirstLetter(letter);
      }
    });
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
    this.mainRecipes = [];
    this.filteredRecipes = [];

    for (let i = 0; i < count; i++) {
      this.mealService.getSingleRandomMeal().subscribe((meal) => {
        this.mainRecipes.push(meal);
        this.filteredRecipes = [...this.mainRecipes]; // ajouter les recettes à la liste filtrée | il faudrait prendre les recettes en communes, et non l'union des recettes filtrés
        this.isLoading = false;
      });
    }
  }

  loadSavedRecipes(): void {
    // Simuler le chargement des recettes sauvegardées
    // Faire une requête à Firebase pour récupérer les recettes favorites
    this.mealService.getMealById('52771').subscribe((meal) => {
      this.favoriteRecipes = [meal];
    });

    this.mealService.getMealById('52772').subscribe((meal) => {
      this.favoriteRecipes.push(meal);
    });
  }

  searchMeals(term: string): void {
    this.isLoading = true;
    this.mealService.getMealByName(term).subscribe((meals) => {
      if (meals) {
        this.mainRecipes = meals;
        this.filteredRecipes = [...this.mainRecipes];
      } else {
        this.mainRecipes = []; // pas de recettes trouvées
        this.filteredRecipes = []; // pas de recettes trouvées
      }
      this.isLoading = false;
    });
  }

  filterByCategory(category: string): void {
    this.isLoading = true;
    this.mealService
      .getAllMealsFilterByCategory(category)
      .subscribe((meals) => {
        this.mainRecipes = meals;
        this.filteredRecipes = [...this.mainRecipes];
        this.isLoading = false;
      });
  }

  filterByRegion(region: string): void {
    this.isLoading = true;
    this.mealService.getAllMealsFilterByArea(region).subscribe((meals) => {
      this.mainRecipes = meals;
      this.filteredRecipes = [...this.mainRecipes];
      this.isLoading = false;
    });
  }

  filterByFirstLetter(letter: string): void {
    this.isLoading = true;
    this.mealService.getAllMealsByFirstLetter(letter).subscribe((meals) => {
      this.mainRecipes = meals;
      this.filteredRecipes = [...this.mainRecipes];
      this.isLoading = false;
    });
  }

  resetFilters(): void {
    this.selectedCategory.setValue('');
    this.selectedRegion.setValue('');
    this.selectedIngredientsList.setValue({ listName: '', ingredients: [''] });
    this.selectedLetter.setValue('');
    this.searchControl.setValue('');
    this.loadRandomMeals(10);
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
    if (!this.favoriteRecipes.some((r) => r.idMeal === recipe.idMeal)) {
      this.favoriteRecipes.push(recipe);
    }
  }

  removeFromFavorites(recipe: Meal): void {
    this.favoriteRecipes = this.favoriteRecipes.filter(
      (r) => r.idMeal !== recipe.idMeal
    );
  }

  // implementer le drag and drop pour les recettes favorites
}
