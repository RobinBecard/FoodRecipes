import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Meal } from '../models/meal.model';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private baseUrl = "https://www.themealdb.com/api/json/v1"

  public getMealById(idMeal:string):Observable<Meal> 
  {
    return this.http.get<{meals:Meal[]}>(this.baseUrl+"/1/lookup.php?i="+idMeal)
    .pipe(
      map(response => response.meals[0])
    );
  }


}
