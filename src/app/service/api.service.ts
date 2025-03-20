import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, mergeMap, Observable, switchMap, toArray } from 'rxjs';
import { Category } from '../models/category.model';
import { Meal, MealSimplify } from '../models/meal.model';
import { Ingredient } from '../models/ingredient.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  private baseUrl = 'https://www.themealdb.com/api/json/v1';

  // Méthode privée pour transformer les données brutes en format Meal
  private transformToMeal(rawMeal: any): Meal {
    // Extraction des ingrédients non vides
    const ingredients: string[] = [];
    const measures: string[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = rawMeal[`strIngredient${i}`];
      const measure = rawMeal[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(ingredient);
        measures.push(measure || '');
      }
    }

    return {
      idMeal: rawMeal.idMeal,
      strMeal: rawMeal.strMeal,
      strCategory: rawMeal.strCategory,
      strArea: rawMeal.strArea,
      strInstructions: rawMeal.strInstructions,
      strMealThumb: rawMeal.strMealThumb,
      strYoutube: rawMeal.strYoutube,
      strIngredients: ingredients,
      strMeasures: measures,
      strSource: rawMeal.strSource,
    };
  }

  // Get Meal
  public getMealByName(name: string): Observable<Meal[]> {
    return this.http
      .get<{ meals: any[] }>(this.baseUrl + '/1/search.php?s=' + name)
      .pipe(
        map((response) => {
          if (!response.meals) return [];
          return response.meals.map((meal) => this.transformToMeal(meal));
        })
      );
  }

  public getAllMealsByFirstLetter(Letter: string): Observable<Meal[]> {
    return this.http
      .get<{ meals: any[] }>(this.baseUrl + '/1/search.php?f=' + Letter)
      .pipe(
        map((response) => {
          if (!response.meals) return [];
          return response.meals.map((meal) => this.transformToMeal(meal));
        })
      );
  }

  public getMealById(idMeal: string): Observable<Meal> {
    return this.http
      .get<{ meals: any[] }>(this.baseUrl + '/1/lookup.php?i=' + idMeal)
      .pipe(
        map((response) => {
          if (!response.meals || response.meals.length === 0) {
            throw new Error('Meal not found');
          }
          return this.transformToMeal(response.meals[0]);
        })
      );
  }

  public getSingleRandomMeal(): Observable<Meal> {
    return this.http.get<{ meals: any[] }>(this.baseUrl + '/1/random.php').pipe(
      map((response) => {
        if (!response.meals || response.meals.length === 0) {
          throw new Error('No meal found');
        }
        return this.transformToMeal(response.meals[0]);
      })
    );
  }

  // Get Categories, Areas, Ingredients
  public getAllMealCategories(): Observable<Category[]> {
    return this.http
      .get<{ categories: Category[] }>(this.baseUrl + '/1/categories.php')
      .pipe(map((response) => response.categories));
  }

  public getAllAreas(): Observable<string[]> {
    return this.http
      .get<{ meals: Meal[] }>(this.baseUrl + '/1/list.php?a=list')
      .pipe(
        map((response) => {
          const areas = response.meals.map((meal) => meal.strArea);
          return areas;
        })
      );
  }

  public getAllIngredients(): Observable<Ingredient[]> {
    return this.http
      .get<{ meals: Ingredient[] }>(this.baseUrl + '/1/list.php?i=list')
      .pipe(map((response) => response.meals));
  }

  // récupérer les repas complets à partir des filtres

  public getAllMealsFilterByMainIngredient(
    ingredient: string
  ): Observable<Meal[]> {
    return this.http
      .get<{ meals: MealSimplify[] }>(
        this.baseUrl + '/1/filter.php?i=' + ingredient
      )
      .pipe(
        switchMap((response) => {
          if (!response.meals) return from([]);

          return from(response.meals).pipe(
            mergeMap(
              (mealSimplify) => this.getMealById(mealSimplify.idMeal),
              5
            ),
            toArray()
          );
        })
      );
  }

  public getAllMealsFilterByCategory(category: string): Observable<Meal[]> {
    return this.http
      .get<{ meals: MealSimplify[] }>(
        this.baseUrl + '/1/filter.php?c=' + category
      )
      .pipe(
        switchMap((response) => {
          if (!response.meals) return from([]);

          return from(response.meals).pipe(
            mergeMap(
              (mealSimplify) => this.getMealById(mealSimplify.idMeal),
              5
            ),
            toArray()
          );
        })
      );
  }

  public getAllMealsFilterByArea(area: string): Observable<Meal[]> {
    return this.http
      .get<{ meals: MealSimplify[] }>(this.baseUrl + '/1/filter.php?a=' + area)
      .pipe(
        switchMap((response) => {
          if (!response.meals) return from([]);

          return from(response.meals).pipe(
            mergeMap(
              (mealSimplify) => this.getMealById(mealSimplify.idMeal),
              5
            ),
            toArray()
          );
        })
      );
  }
}
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  sendOtp(phoneNumber: string, recaptchaVerifier: any) {
    return this.afAuth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
  }

  verifyOtp(confirmationResult: any, otpCode: string) {
    return confirmationResult.confirm(otpCode);
  }
}