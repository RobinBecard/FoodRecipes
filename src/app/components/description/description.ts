import { Component, Input, OnInit } from '@angular/core';
import { Meal } from '../../models/meal.model';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'description',
  templateUrl: './description.html',
  styleUrls: ['./description.css'], // Correction ici
  standalone: false,
})
export class DescriptionComponent{
  @Input() Recipe!: Meal;
}
