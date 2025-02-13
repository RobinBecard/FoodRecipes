import { Component } from '@angular/core';
import { Meal } from '../../models/meal.model';
import { ApiService } from '../../service/api.meal.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {
  constructor(private api:ApiService) {}
  public myMeal?: Meal;
    public ngOnInit(){
      this.api.getMealById("52772").subscribe((meal:Meal)=>{
        console.log("ça marche")
        this.myMeal = meal
      });
    }
}
