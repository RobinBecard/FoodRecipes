import { Component, OnInit } from '@angular/core';
import { Meal } from '../../models/meal.model';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'description',
  templateUrl: './description.html',
  styleUrls: ['./description.css'], // Correction ici
  standalone: false,
})
export class DescriptionComponent implements OnInit {
  
  Recipe!: Meal; // Ajout de la propriété meal

  constructor(private mealService: ApiService) {} // Correction du constructeur

  ngOnInit(): void {
    this.mealService.getMealById('52771').subscribe((meal) => {
      this.Recipe = meal;
      console.log(meal)
    });
  }
}
