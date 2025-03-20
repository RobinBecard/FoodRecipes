import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { Ingredient, IngredientList } from '../models/ingredient.model';
import { Meal } from '../models/meal.model';
import { ApiService } from './api.service';

export interface Filter {
  value: string;
  active: boolean;
}

export interface FilterState {
  search: Filter;
  category: Filter;
  region: Filter;
  letter: Filter;
  ingredientsList: Filter;
}

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filters: FilterState = {
    search: { value: '', active: false },
    category: { value: '', active: false },
    region: { value: '', active: false },
    letter: { value: '', active: false },
    ingredientsList: { value: '', active: false },
  };

  constructor(private mealService: ApiService) {}

  get filterState(): FilterState {
    return this.filters;
  }

  resetFilters(): void {
    this.filters = {
      search: { value: '', active: false },
      category: { value: '', active: false },
      region: { value: '', active: false },
      letter: { value: '', active: false },
      ingredientsList: { value: '', active: false },
    };
  }

  setFilter(type: keyof FilterState, value: string, active: boolean): void {
    this.filters[type] = { value, active };
  }

  applyFilters(): Observable<Meal[]> {
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

    // Si aucun filtre n'est actif, retourner un observable vide
    // pour que le composant puisse charger des recettes aléatoires
    if (observables.length === 0) {
      return of([]);
    }

    // Combiner les résultats par intersection (ET logique)
    return forkJoin(observables).pipe(
      map((results) => {
        if (results.length === 0) {
          return [];
        }

        // Commencer avec le premier résultat
        let combined: Meal[] = results[0] || [];

        // Faire l'intersection avec les autres résultats
        for (let i = 1; i < results.length; i++) {
          combined = combined.filter((meal) =>
            results[i].some((m) => m.idMeal === meal.idMeal)
          );
        }

        return combined;
      })
    );
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

  filterByIngredientsList(
    listName: string,
    ingredientsList: IngredientList[] = []
  ): Observable<Meal[]> {
    const selectedList = ingredientsList.find((list) => list.name === listName);
    if (!selectedList || selectedList.ingredients.length === 0) {
      return of([]); // renvoie un tableau vide
    }
    const ingredients = selectedList.ingredients;
    const requests = ingredients.map((ingredient) =>
      this.mealService.getAllMealsFilterByMainIngredient(
        ingredient.strIngredient
      )
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

  // Fonction pour calculer le score de correspondance
  calculateMatchScore(meal: Meal, ingredientsList: Ingredient[]): number {
    let score = 0;
    const mealIngredients: string[] = meal.strIngredients;

    ingredientsList.forEach((ingredient) => {
      if (
        mealIngredients.some(
          (mealIng) =>
            mealIng
              .toLowerCase()
              .includes(ingredient.strIngredient.toLowerCase()) ||
            ingredient.strIngredient.toLowerCase().includes(mealIng)
        )
      ) {
        score++;
      }
    });

    return (score / ingredientsList.length) * 100;
  }
}
