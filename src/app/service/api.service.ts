import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { Ingredient } from '../models/ingredient.model';
import { Meal, MealSimplify } from '../models/meal.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'https://www.themealdb.com/api/json/v1';

  // Get Meal

  public getMealByName(name: string): Observable<Meal[]> {
    return this.http
      .get<{ meals: Meal[] }>(this.baseUrl + '/1/search.php?s=' + name)
      .pipe(map((response) => response.meals));
  }

  public getAllMealsByFirstLetter(Letter: string): Observable<Meal[]> {
    return this.http
      .get<{ meals: Meal[] }>(this.baseUrl + '/1/search.php?f=' + Letter)
      .pipe(map((response) => response.meals));
  }

  public getMealById(idMeal: string): Observable<Meal> {
    return this.http
      .get<{ meals: Meal[] }>(this.baseUrl + '/1/lookup.php?i=' + idMeal)
      .pipe(map((response) => response.meals[0]));
  }

  public getSingleRandomMeal(): Observable<Meal> {
    return this.http
      .get<{ meals: Meal[] }>(this.baseUrl + '/1/random.php')
      .pipe(map((response) => response.meals[0]));
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
          console.log(areas);
          return areas;
        })
      );
  }

  public getAllIngredients(): Observable<Ingredient[]> {
    return this.http
      .get<{ meals: Ingredient[] }>(this.baseUrl + '/1/list.php?i=list')
      .pipe(map((response) => response.meals));
  }

  // Filter Meals (MealSimplify)

  public getAllMealsFilterByMainIngredient(
    ingredient: string
  ): Observable<MealSimplify[]> {
    return this.http
      .get<{ meals: MealSimplify[] }>(
        this.baseUrl + '/1/filter.php?i=' + ingredient
      )
      .pipe(map((response) => response.meals));
  }

  public getAllMealsFilterByCategory(
    category: string
  ): Observable<MealSimplify[]> {
    return this.http
      .get<{ meals: MealSimplify[] }>(
        this.baseUrl + '/1/filter.php?c=' + category
      )
      .pipe(map((response) => response.meals));
  }

  public getAllMealsFilterByArea(area: string): Observable<MealSimplify[]> {
    return this.http
      .get<{ meals: MealSimplify[] }>(this.baseUrl + '/1/filter.php?a=' + area)
      .pipe(map((response) => response.meals));
  }
}
