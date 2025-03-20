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
  map,
  Observable,
  of,
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
        // Réinitialiser les autres filtres exclusifs
        this.selectedIngredientsList.setValue('', { emitEvent: false });
        this.filters.ingredientsList = { value: '', active: false };
        this.selectedLetter.setValue('', { emitEvent: false });
        this.filters.letter = { value: '', active: false };
        if (term && term.length > 1) {
          this.filters.search = { value: term, active: true };
        } else if (!term) {
          this.searchControl.setValue('', { emitEvent: false });
          this.filters.search = { value: '', active: false };
        }
        this.applyFilters();
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

  loadRandomMeals(count: number): Observable<Meal[]> {
    const requests: Observable<Meal>[] = [];
    for (let i = 0; i < count; i++) {
      requests.push(this.mealService.getSingleRandomMeal());
    }
    return forkJoin(requests).pipe(
      map((meals) => {
        const uniqueMeals: Meal[] = [];
        meals.forEach((meal) => {
          if (!uniqueMeals.some((m) => m.idMeal === meal.idMeal)) {
            uniqueMeals.push(meal);
          }
        });
        return uniqueMeals;
      })
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

  applyFilters(): void {
    // Commencer avec des observables vides
    let observables: Observable<Meal[]>[] = [];

    // N'ajouter que les filtres actifs
    if (this.filters.search.active) {
      observables.push(this.searchMeals(this.filters.search.value));
    }
    if (this.filters.category.active) {
      observables.push(this.filterByCategory(this.filters.category.value));
    }
    if (this.filters.region.active) {
      observables.push(this.filterByRegion(this.filters.region.value));
    }
    if (this.filters.letter.active) {
      observables.push(this.filterByFirstLetter(this.filters.letter.value));
    }
    if (this.filters.ingredientsList.active) {
      observables.push(
        this.filterByIngredientsList(this.filters.ingredientsList.value)
      );
    }

    // Si aucun filtre n'est actif, charger des recettes aléatoires
    if (observables.length === 0) {
      this.loadRandomMeals(15).subscribe((meals) => {
        this.RecipesList = meals;
      });
      return;
    }

    // Combiner les résultats par intersection (ET logique)
    forkJoin(observables).subscribe(
      (results) => {
        if (results.length === 0) {
          this.RecipesList = [];
          return;
        }

        // Commencer avec le premier résultat
        let combined: Meal[] = results[0] || [];

        // Faire l'intersection avec les autres résultats
        for (let i = 1; i < results.length; i++) {
          combined = combined.filter((meal) =>
            results[i].some((m) => m.idMeal === meal.idMeal)
          );
        }

        console.log('Filtered recipes:', combined);
        this.RecipesList = combined;
      },
      (error) => {
        console.error('Error applying filters:', error);
        // En cas d'erreur, peut-être charger des recettes aléatoires
        this.loadRandomMeals(5).subscribe((meals) => {
          this.RecipesList = meals;
        });
      }
    );
  }

  searchMeals(term: string): Observable<Meal[]> {
    return this.mealService
      .getMealByName(term)
      .pipe(map((meals) => (meals ? meals : [])));
  }

  filterByCategory(category: string): Observable<Meal[]> {
    return this.mealService
      .getAllMealsFilterByCategory(category)
      .pipe(map((meals) => (meals ? meals : [])));
  }

  filterByRegion(region: string): Observable<Meal[]> {
    return this.mealService
      .getAllMealsFilterByArea(region)
      .pipe(map((meals) => (meals ? meals : [])));
  }

  filterByFirstLetter(letter: string): Observable<Meal[]> {
    return this.mealService
      .getAllMealsByFirstLetter(letter)
      .pipe(map((meals) => (meals ? meals : [])));
  }

  filterByIngredientsList(listName: string): Observable<Meal[]> {
    const selectedList = this.ingredientsList.find(
      (list) => list.listName === listName
    );
    if (!selectedList || selectedList.ingredients.length === 0) {
      return of([]); // renvoie un tableau vide
    }
    const ingredients = selectedList.ingredients;
    const requests = ingredients.map((ingredient) =>
      this.mealService.getAllMealsFilterByMainIngredient(ingredient)
    );
    return forkJoin(requests).pipe(
      map((results) => {
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
        return allRecipes;
      })
    );
  }

  resetFilters(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.selectedCategory.setValue('', { emitEvent: false });
    this.selectedRegion.setValue('', { emitEvent: false });
    this.selectedIngredientsList.setValue('', { emitEvent: false });
    this.selectedLetter.setValue('', { emitEvent: false });

    this.filters = {
      search: { value: '', active: false },
      category: { value: '', active: false },
      region: { value: '', active: false },
      letter: { value: '', active: false },
      ingredientsList: { value: '', active: false },
    };
    this.applyFilters();
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
          this.filters[name as keyof typeof this.filters] = {
            value: '',
            active: false,
          };
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
        this.filters[nom] = { value, active: true };
      } else {
        if (nom == 'letter') {
          // Ne pas déclencher un nouvel événement lors de cette réinitialisation
          this.selectedLetter.setValue('', { emitEvent: false });
        } else if (nom == 'ingredientsList') {
          this.selectedIngredientsList.setValue('', { emitEvent: false });
        }
        this.filters[nom] = { value: '', active: false };
      }
      this.applyFilters();
    });
  }

  // Fonction pour calculer le score de correspondance
  calculateMatchScore(meal: Meal, ingredientsList: string[]): number {
    let score = 0;
    const mealIngredients: string[] = meal.strIngredients;

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
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
