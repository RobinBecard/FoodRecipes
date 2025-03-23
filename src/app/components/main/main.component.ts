import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  Subscription,
} from 'rxjs';
import {Meal} from '../../models/meal.model';
import { ApiService } from '../../service/api.service';
import { DescriptionComponent } from '../description/description';
import { MatDialog } from '@angular/material/dialog';
import { Ingredient, IngredientList } from '../../models/ingredient.model';
import { ListIngredientService } from '../../service/list-ingredient.service';
import { query } from 'firebase/firestore';
import { __param } from 'tslib';
import { FavoriteRecipesService } from '../../service/favorite-recipes.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: false,
})
export class MainComponent implements OnInit {
  RecipesList: Meal[] = []; // Liste de recettes filtrées
  favoriteRecipesList: Meal[] = []; // Liste des recettes favorites : à récupérer et sauvegarder avec firebase

  categories: string[] = [];
  regions: string[] = [];
  ingredientsList: IngredientList[] = [];

  // Options de filtrage
  searchControl = new FormControl(''); // pour la recherche
  selectedCategory = new FormControl(''); // pour les catégories
  selectedRegion = new FormControl(''); // pour les régions
  selectedIngredientsList = new FormControl(''); // pour les listes d'ingrédients
  selectedLetter = new FormControl(''); // pour les lettres

  isLoading = false;
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  isSidebarOpen = false;
  private breakpointSubscription: Subscription = new Subscription();

  constructor(
    private mealService: ApiService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private listService : ListIngredientService,
    private favoriteService: FavoriteRecipesService
  ) {}

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
    this.observeChanges(
      this.selectedIngredientsList,
      this.filterByIngredientsList.bind(this)
    );

    this.breakpointSubscription = this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        // Si l'écran correspond à Small ou HandsetPortrait, fermez la sidebar
        if (result.matches) {
          this.isSidebarOpen = false;
        }
      });

    // Vérifiez la taille de l'écran au démarrage
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    } else {
      // Si l'écran est grand au démarrage, la sidebar peut être ouverte par défaut
      this.isSidebarOpen = true;
    }
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

  // Charger les listes d'ingrédients depuis Firebase
  loadIngredientsList(): void {
    this.listService.getUserLists().subscribe(
      (lists: IngredientList[]) => {
        this.ingredientsList = lists;  // Met à jour la liste avec les données récupérées
      },
      (error) => {
        console.error('Erreur lors de la récupération des listes:', error);
      }
    );
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
    // Get favorites from Firebase
    this.favoriteService.getFavoriteRecipes().subscribe(
      (favorites: Meal[]) => {
        this.favoriteRecipesList = favorites;
      },
      (error) => {
        console.error('Error fetching favorite recipes:', error);
      }
    );
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

  filterByIngredientsList(listName: string): void {
    this.isLoading = true;

    const selectedList = this.ingredientsList.find(
      (list) => list.name === listName
    );
    if (!selectedList || selectedList.ingredients.length === 0) {
      this.isLoading = false;
      return;
    }
    const ingredients = selectedList.ingredients;
    // Créer un tableau d'observables
    const requests = ingredients.map((ingredient) =>
      this.mealService.getAllMealsFilterByMainIngredient(ingredient.strIngredient)
    );

    // Utiliser forkJoin pour attendre TOUTES les requêtes
    forkJoin(requests).subscribe(
      (results) => {
        let allRecipes: Meal[] = [];
        results.forEach((meals) => {
          if (meals) {
            meals.forEach((meal) => {
              // Éviter les doublons
              if (!allRecipes.some((r) => r.idMeal === meal.idMeal)) {
                meal.matchScore = this.calculateMatchScore(meal, ingredients);
                allRecipes.push(meal);
              }
            });
          }
        });
        allRecipes.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)); // score décroissant
        this.RecipesList = allRecipes;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du filtrage par ingrédients:', error);
        this.isLoading = false;
      }
    );
  }

  resetFilters(): void {
    this.selectedCategory.setValue('');
    this.selectedRegion.setValue('');
    this.selectedIngredientsList.setValue('');
    this.selectedLetter.setValue('');
    this.searchControl.setValue('');
    this.loadRandomMeals(15);
  }

  drop(event: CdkDragDrop<any[]>) {
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
    this.RecipesList = [...this.RecipesList];
  }
/*
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
*/
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

  // Fonction pour calculer le score de correspondance
  calculateMatchScore(meal: Meal, ingredientsList: Ingredient[]): number {
    let score = 0;

    // Récupérer tous les ingrédients du plat (non vides)
    const mealIngredients: string[] = meal.strIngredients;

    // Compter combien d'ingrédients de la liste sont présents dans la recette
    ingredientsList.forEach((ingredient) => {
      if (
        mealIngredients.some(
          (mealIng) =>
            mealIng.toLowerCase().includes(ingredient.strIngredient.toLowerCase()) ||
            ingredient.strIngredient.toLowerCase().includes(mealIng)
        )
      ) {
        score++;
      }
    });

    return (score / ingredientsList.length) * 100;
  }

  addList(): void {
    this.router.navigate(['/CreateList']);
  }
  
  editList(listID:string):void {
    this.router.navigate(['/EditList', listID]);
  }
  ngOnDestroy() {
    // Nettoyez l'abonnement pour éviter les fuites de mémoire
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openDescriptionDialog(recipeId: string): void {
    const dialogWidth = window.innerWidth < 768 ? '95vw' : '95vw';
    const dialogMaxHeight = '90vh';
  
    this.dialog.open(DescriptionComponent, {
      width: dialogWidth,
      maxHeight: dialogMaxHeight,
      data: { id: recipeId },
    });
  }
  
}
