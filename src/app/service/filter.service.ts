/**
 * Service de filtrage pour les recettes.
 *
 * Ce service gère les différents filtres pour rechercher des recettes et permet de les combiner.
 *
 * Méthodes principales:
 * - get filterState(): Retourne l'état actuel de tous les filtres
 * - resetFilter(name): Réinitialise un filtre spécifique
 * - resetFilters(): Réinitialise tous les filtres
 * - setFilter(name, value, active): Définit un filtre avec une valeur et un état
 * - applyFilters(): Applique tous les filtres actifs et retourne les recettes correspondantes (intersection)
 * - loadRandomMeals(count): Charge un nombre spécifié de recettes aléatoires
 *
 * Méthodes de filtrage:
 * - searchMeals(term): Recherche des recettes par nom
 * - filterByCategory(category): Filtre les recettes par catégorie
 * - filterByRegion(region): Filtre les recettes par région
 * - filterByFirstLetter(letter): Filtre les recettes par première lettre
 * - filterByIngredientsList(listName, ingredientsList): Filtre les recettes par liste d'ingrédients
 *
 * Méthodes utilitaires:
 * - calculateMatchScore(meal, ingredientsList): Calcule un score de correspondance pour une recette
 *   basé sur le nombre d'ingrédients correspondants dans la liste
 */

import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { FilterState } from '../models/filter.model';
import { Ingredient, IngredientList } from '../models/ingredient.model';
import { Meal } from '../models/meal.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  randomRecipesNumber: number = 50;
  private listOfIngredientsList: IngredientList[] = [];
  private filters: FilterState = {
    search: { value: '', active: false },
    category: { value: '', active: false },
    region: { value: '', active: false },
    letter: { value: '', active: false },
    ingredientsList: { value: '', active: false },
  };

  constructor(private mealService: ApiService) {}

  setIngredientsList(list: IngredientList[]): void {
    this.listOfIngredientsList = list;
  }

  get filterState(): FilterState {
    return this.filters;
  }

  resetFilter(name: keyof FilterState): void {
    if (name && this.filters[name]) {
      this.filters[name].value = '';
      this.filters[name].active = false;
    }
  }

  resetFilters(): void {
    for (const key in this.filters) {
      this.resetFilter(key as keyof FilterState);
    }
  }

  setFilter(name: keyof FilterState, value: string, active: boolean): void {
    this.filters[name] = { value, active };
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
      // la valeur de la liste d'ingrédients est l'id de la liste
      observables.push(
        this.filterByIngredientsList(this.filters.ingredientsList.value)
      );
    }

    // Si aucun filtre n'est actif --> aléatoire
    if (observables.length === 0) {
      return this.loadRandomMeals(15);
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
    this.resetFilters();
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

  filterByIngredientsList(ingredientsListID: string): Observable<Meal[]> {
    const selectedList = this.listOfIngredientsList.find(
      (list) => list.id === ingredientsListID
    );
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

    return (score * 100) / ingredientsList.length;
  }
}
