import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Meal } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit{
  constructor(private api:ApiService) {}
  public myMeal?: Meal;
  public ngOnInit(){
    this.api.getMeal("52772").subscribe((meal)=>{
      console.log("ça marche")
      this.myMeal = meal
    });
  }
  title="FoodRecipes";
}
