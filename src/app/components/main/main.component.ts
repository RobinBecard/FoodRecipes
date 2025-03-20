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
  Observable,
  Subscription,
} from 'rxjs';
import { IngredientList } from '../../models/ingredient.model';
import { Meal } from '../../models/meal.model';
import { ApiService } from '../../service/api.service';
import { FilterService } from '../../service/filter.service';
import { ListIngredientService } from '../../service/list-ingredient.service';

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

  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  isSidebarOpen = false;
  private breakpointSubscription: Subscription = new Subscription();

  constructor(
    private mealService: ApiService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private listService: ListIngredientService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.loadInitialData(); // Charger les données initiales

    // Configurer la recherche
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        // Réinitialiser les autres filtres exclusifs
        this.selectedIngredientsList.setValue('', { emitEvent: false });
        this.selectedLetter.setValue('', { emitEvent: false });
        this.filterService.setFilter('ingredientsList', '', false);
        this.filterService.setFilter('letter', '', false);

        if (term && term.length > 1) {
          this.filterService.setFilter('search', term, true);
        } else if (!term) {
          this.searchControl.setValue('', { emitEvent: false });
          this.filterService.setFilter('search', '', false);
        }
        this.updateRecipesList();
      });

    // Observer les changements de catégories, de régions, de lettres et de listes d'ingrédients
    this.observeChanges(this.selectedCategory, 'category');
    this.observeChanges(this.selectedRegion, 'region');
    this.observeChanges(this.selectedLetter, 'letter', true);
    this.observeChanges(this.selectedIngredientsList, 'ingredientsList', true);

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
    // Charger les catégories
    this.mealService.getAllMealCategories().subscribe((categories) => {
      this.categories = categories.map((cat) => cat.strCategory);
    });

    // Charger les régions
    this.mealService.getAllAreas().subscribe((areas) => {
      this.regions = areas;
    });

    // Charger la liste d'ingrédients
    this.loadIngredientsList();

    // Charger des recettes aléatoires
    this.loadRandomMeals(15).subscribe((meals) => {
      this.RecipesList = meals;
    });

    // Simuler le chargement des recettes favorites
    this.loadSavedRecipes();
  }

  // Exposer la méthode pour qu'elle puisse être appelée depuis l'HTML
  loadRandomMeals(count: number): Observable<Meal[]> {
    return this.filterService.loadRandomMeals(count);
  }

  // Charger les listes d'ingrédients depuis Firebase
  loadIngredientsList(): void {
    this.listService.getUserLists().subscribe(
      (lists: IngredientList[]) => {
        this.ingredientsList = lists; // Met à jour la liste avec les données récupérées
      },
      (error) => {
        console.error('Erreur lors de la récupération des listes:', error);
      }
    );
  }

  loadSavedRecipes(): void {
    // Simuler le chargement des recettes sauvegardées
    this.mealService.getMealById('52771').subscribe((meal) => {
      this.favoriteRecipesList = [meal];
    });

    this.mealService.getMealById('52772').subscribe((meal) => {
      this.favoriteRecipesList.push(meal);
    });
  }

  updateRecipesList(): void {
    this.filterService.applyFilters().subscribe(
      (meals) => {
        // Si aucun filtre n'est actif, charger des recettes aléatoires
        if (meals.length === 0 && !this.hasActiveFilters()) {
          this.loadRandomMeals(15).subscribe((randomMeals) => {
            this.RecipesList = randomMeals;
          });
        } else {
          this.RecipesList = meals;
        }
      },
      (error) => {
        console.error('Error applying filters:', error);
        this.loadRandomMeals(5).subscribe((meals) => {
          this.RecipesList = meals;
        });
      }
    );
  }

  hasActiveFilters(): boolean {
    const filters = this.filterService.filterState;
    return Object.values(filters).some((filter) => filter.active);
  }

  resetFilters(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.selectedCategory.setValue('', { emitEvent: false });
    this.selectedRegion.setValue('', { emitEvent: false });
    this.selectedIngredientsList.setValue('', { emitEvent: false });
    this.selectedLetter.setValue('', { emitEvent: false });

    this.filterService.resetFilters();
    this.updateRecipesList();
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
    nom: 'category' | 'region' | 'letter' | 'ingredientsList',
    exclusions: boolean = false
  ): void {
    control.valueChanges.subscribe((value) => {
      if (exclusions) {
        // Réinitialiser les autres filtres exclusifs sans déclencher d'événements
        const exclusifs = ['letter', 'ingredientsList', 'search'];
        const autresFiltres = exclusifs.filter((name) => name !== nom);
        autresFiltres.forEach((name) => {
          this.filterService.setFilter(
            name as keyof typeof this.filterService.filterState,
            '',
            false
          );

          // Utiliser { emitEvent: false } pour éviter les boucles
          if (name === 'letter') {
            this.selectedLetter.setValue('', { emitEvent: false });
          } else if (name === 'ingredientsList') {
            this.selectedIngredientsList.setValue('', { emitEvent: false });
          } else if (name === 'search') {
            this.searchControl.setValue('', { emitEvent: false });
          }
        });
      }

      if (value && value.length > 0) {
        this.filterService.setFilter(nom, value, true);
      } else {
        if (nom == 'letter') {
          // Ne pas déclencher un nouvel événement lors de cette réinitialisation
          this.selectedLetter.setValue('', { emitEvent: false });
        } else if (nom == 'ingredientsList') {
          this.selectedIngredientsList.setValue('', { emitEvent: false });
        }
        this.filterService.setFilter(nom, '', false);
      }

      // Mise à jour de la liste des recettes
      this.updateRecipesList();
    });
  }

  addList(): void {
    this.router.navigate(['/CreateList']);
  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
