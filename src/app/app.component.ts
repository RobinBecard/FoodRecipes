import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Meal } from './models';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent{
  title="FoodRecipes";
}
