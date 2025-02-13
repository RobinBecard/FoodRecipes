import { Component } from '@angular/core';
import { Meal } from '../../models';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {
  constructor(private api:ApiService) {}
  public myMeal?: Meal;
    public ngOnInit(){
      this.api.getMeal("52772").subscribe((meal:Meal)=>{
        console.log("ça marche")
        this.myMeal = meal
      });
    }
}
