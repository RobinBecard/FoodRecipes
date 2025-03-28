import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IngredientList } from '../../models/ingredient.model';
import { Meal } from '../../models/meal.model';
import { ApiService } from '../../service/api.service';
import { FavoriteRecipesService } from '../../service/favorite-recipes.service';
import { FilterService } from '../../service/filter.service';
import { ListIngredientService } from '../../service/list-ingredient.service';
import { DescriptionComponent } from '../description/description';
import { FilterComponent } from '../filter/filter.component';
import { ListDescriptionComponent } from '../list-description/list-description.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: false,
})
export class MainComponent implements OnInit {
  @ViewChild(FilterComponent) filterComponent!: FilterComponent;

  randomRecipesNumber: number = 50;
  RecipesList: Meal[] = []; // Liste de recettes filtrées
  favoriteRecipesList: Meal[] = []; // Liste des recettes favorites : à récupérer et sauvegarder avec firebase

  ingredientsList: IngredientList[] = [];

  isSidebarOpen = false;
  private breakpointSubscription: Subscription = new Subscription();

  constructor(
    private mealService: ApiService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private filterService: FilterService,
    private dialog: MatDialog,
    private listService: ListIngredientService,
    private favoriteService: FavoriteRecipesService
  ) {}

  ngOnInit(): void {
    this.loadInitialData(); // Charger les données initiales

    // #### Sidebar ####
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
    // Charger la liste des liste d'ingrédients
    this.loadIngredientsList();

    // Simuler le chargement des recettes favorites
    this.loadFavoriteRecipes();
  }

  loadRandomMeals(count: number): void {
    this.filterService.loadRandomMeals(count).subscribe((meals: Meal[]) => {
      this.RecipesList = meals;
      console.log('Recettes aléatoires chargées:', meals);
    });
  }

  // #### Liste d'ingrédients  ####

  addList(): void {
    this.router.navigate(['/CreateList']);
  }

  editList(listID: string): void {
    this.router.navigate(['/EditList', listID]);
  }

  // Charger les listes d'ingrédients depuis Firebase
  loadIngredientsList(): void {
    this.listService.getUserLists().subscribe(
      (lists: IngredientList[]) => {
        this.ingredientsList = lists; // Met à jour la liste avec les données récupérées
        this.filterService.setIngredientsList(lists); // Met à jour le service de filtre
      },
      (error) => {
        console.error('Erreur lors de la récupération des listes:', error);
      }
    );
  }

  // #### Favoris ####
  loadFavoriteRecipes(): void {
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

  // #### Boutons Reset ####
  onReset(): void {
    // Vérifier si le composant enfant est bien chargé
    if (this.filterComponent) {
      this.filterService.resetFilters();
      this.filterComponent.resetFormControls();
      this.loadRandomMeals(15);
    }
  }

  // #### Sidebar ####

  ngOnDestroy() {
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

  openDescriptionListDialog(ingredientList: IngredientList): void {
    const dialogWidth = window.innerWidth < 768 ? '60vw' : '60vw';
    const dialogMaxHeight = '90vh';

    this.dialog.open(ListDescriptionComponent, {
      width: dialogWidth,
      maxHeight: dialogMaxHeight,
      data: ingredientList,
    });
  }
}
