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
import { IngredientsList, Meal } from '../../models/meal.model';
import { ApiService } from '../../service/api.service';

interface Filter {
  value: string;
  active: boolean;
}

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
  ingredientsList: IngredientsList[] = [];

  // Options de filtrage
  searchControl = new FormControl(''); // pour la recherche
  selectedCategory = new FormControl(''); // pour les catégories
  selectedRegion = new FormControl(''); // pour les régions
  selectedIngredientsList = new FormControl(''); // pour les listes d'ingrédients
  selectedLetter = new FormControl(''); // pour les lettres

  // Sauvegarder l'état du filtre et sa valeur
  filters: {
    [key in
      | 'search'
      | 'category'
      | 'region'
      | 'letter'
      | 'ingredientsList']: Filter;
  } = {
    search: { value: '', active: false },
    category: { value: '', active: false },
    region: { value: '', active: false },
    letter: { value: '', active: false },
    ingredientsList: { value: '', active: false },
  };
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  isSidebarOpen = false;
  private breakpointSubscription: Subscription = new Subscription();

  constructor(
    private mealService: ApiService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.loadInitialData(); // Charger les données initiales : catégories, régions, Liste d'ingrédients, recettes aléatoires, recettes favorites

    // Configurer la recherche
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        if (term && term.length > 1) {
          this.filters.search = { value: term, active: true };
          this.applyFilters();
        } else if (!term) {
          this.searchControl.setValue('');
          this.filters.search = { value: '', active: false };

          // reset les autres filtres
          this.selectedIngredientsList.setValue('');
          this.filters.ingredientsList = { value: '', active: false };
          this.selectedLetter.setValue('');
          this.filters.letter = { value: '', active: false };
        }
      });

    // Observer les changements de catégories, de régions, de lettres
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

    // Charger les liste d'ingrédients
    // Temporairement : charger des ingédients aléatoire | dans l'attente d'une syncronisation avec firebase
    this.loadIngredientsList();

    // Temporairement : charger des recettes aléatoire
    // A FAIRE : se baser sur la liste d'ingrédients selectionnée pour proposer des reco
    this.RecipesList = this.loadRandomMeals(15);

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

      console.log(tempIngredientsList);
      this.ingredientsList = tempIngredientsList;
    });
  }

  loadRandomMeals(count: number): Meal[] {
    // s'assurer que les listes sont vides
    let MealsList: Meal[] = [];

    for (let i = 0; i < count; i++) {
      this.mealService.getSingleRandomMeal().subscribe((meal) => {
        // verifier les doublons
        if (!MealsList.some((r) => r.idMeal === meal.idMeal)) {
          MealsList.push(meal); // ajouter les recettes à la liste filtrée | il faudrait prendre les recettes en communes, et non l'union des recettes filtrés
        }
      });
    }

    return MealsList;
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

  applyFilters(): void {
    let MealsList: Meal[] = [];
    if (this.filters.search.active) {
      MealsList = [...this.searchMeals(this.filters.search.value)];
      MealsList = [...this.filterByCategory(this.filters.category.value)];
      MealsList = [...this.filterByRegion(this.filters.region.value)];
    } else if (this.filters.letter.active) {
      MealsList = [...this.filterByFirstLetter(this.filters.letter.value)];
      MealsList = [...this.filterByCategory(this.filters.category.value)];
      MealsList = [...this.filterByRegion(this.filters.region.value)];
    } else if (this.filters.ingredientsList.active) {
      MealsList = [
        ...this.filterByIngredientsList(this.filters.ingredientsList.value),
      ];
      MealsList = [...this.filterByCategory(this.filters.category.value)];
      MealsList = [...this.filterByRegion(this.filters.region.value)];
    } else if (this.filters.category.active || this.filters.region.active) {
      MealsList = [...this.filterByCategory(this.filters.category.value)];
      MealsList = [...this.filterByRegion(this.filters.region.value)];
    } else {
      MealsList = [...this.loadRandomMeals(15)];
    }
    this.RecipesList = MealsList;
  }

  searchMeals(term: string): Meal[] {
    let MealsList: Meal[] = [];
    this.mealService.getMealByName(term).subscribe((meals) => {
      MealsList = meals ? meals : [];
    });
    return MealsList;
  }

  filterByCategory(category: string): Meal[] {
    let MealsList: Meal[] = [];
    this.mealService
      .getAllMealsFilterByCategory(category)
      .subscribe((meals) => {
        MealsList = meals ? meals : [];
      });
    return MealsList;
  }

  filterByRegion(region: string): Meal[] {
    let MealsList: Meal[] = [];
    this.mealService.getAllMealsFilterByArea(region).subscribe((meals) => {
      MealsList = meals ? meals : [];
    });
    return MealsList;
  }

  filterByFirstLetter(letter: string): Meal[] {
    let MealsList: Meal[] = [];
    this.mealService.getAllMealsByFirstLetter(letter).subscribe((meals) => {
      MealsList = meals ? meals : [];
    });
    return MealsList;
  }

  filterByIngredientsList(listName: string): Meal[] {
    let MealsList: Meal[] = [];
    const selectedList = this.ingredientsList.find(
      (list) => list.listName === listName
    );
    if (!selectedList || selectedList.ingredients.length === 0) {
      return MealsList;
    }
    const ingredients = selectedList.ingredients;
    const requests = ingredients.map((ingredient) =>
      this.mealService.getAllMealsFilterByMainIngredient(ingredient)
    );

    forkJoin(requests).subscribe(
      (results) => {
        let allRecipes: Meal[] = [];
        results.forEach((meals) => {
          if (meals) {
            meals.forEach((meal) => {
              if (!allRecipes.some((r) => r.idMeal === meal.idMeal)) {
                meal.matchScore = this.calculateMatchScore(meal, ingredients);
                allRecipes.push(meal);
              }
            });
          }
        });
        allRecipes.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
        MealsList = allRecipes;
      },
      (error) => {
        console.error('Erreur lors du filtrage par ingrédients:', error);
      }
    );
    return MealsList;
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.selectedCategory.setValue('');
    this.selectedRegion.setValue('');
    this.selectedIngredientsList.setValue('');
    this.selectedLetter.setValue('');

    this.filters = {
      search: { value: '', active: false },
      category: { value: '', active: false },
      region: { value: '', active: false },
      letter: { value: '', active: false },
      ingredientsList: { value: '', active: false },
    };
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
    nom: 'search' | 'category' | 'region' | 'letter' | 'ingredientsList',
    exclusions: boolean = false
  ): void {
    control.valueChanges.subscribe((value) => {
      if (value && nom) {
        this.filters[nom] = { value, active: true };
        this.applyFilters();
      }
    });

    if (exclusions) {
      // Réinitialiser les autres filtres exclusifs
      let exclusifs_name = ['letter', 'ingredientsList', 'search'];
      // retirer le nom du filtre actuel
      exclusifs_name = exclusifs_name.filter((name) => name !== nom);
      // pour chaque filtre exclusif, réinitialiser sa valeur
      exclusifs_name.forEach((name) => {
        this.filters[name as keyof typeof this.filters] = {
          value: '',
          active: false,
        };
        this.selectedLetter.setValue('');
      });
    }
  }

  // Fonction pour calculer le score de correspondance
  calculateMatchScore(meal: Meal, ingredientsList: string[]): number {
    let score = 0;

    // Récupérer tous les ingrédients du plat (non vides)
    const mealIngredients: string[] = meal.strIngredients;

    // Compter combien d'ingrédients de la liste sont présents dans la recette
    ingredientsList.forEach((ingredient) => {
      if (
        mealIngredients.some(
          (mealIng) =>
            mealIng.toLowerCase().includes(ingredient.toLowerCase()) ||
            ingredient.toLowerCase().includes(mealIng)
        )
      ) {
        score++;
      }
    });

    return (score / ingredientsList.length) * 100;
  }

  addRecipe(): void {
    this.router.navigate(['/CreateList']);
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
}
