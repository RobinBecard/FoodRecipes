import { Component, Inject, Input, OnInit } from '@angular/core';
import { Meal } from '../../models/meal.model';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'description',
  templateUrl: './description.html',
  styleUrls: ['./description.css'],
  standalone: false,
})

export class DescriptionComponent implements OnInit {
  @Input() recipe!: Meal;

  constructor(
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string } | null
  ) {}

  ngOnInit(): void {
    if (!this.recipe && this.data?.id) {
      // Si la recette n'est pas passée en Input, on récupère via l'API
      this.apiService.getMealById(this.data.id).subscribe((meal) => {
        this.recipe = meal;
      });
    }
  }
}
