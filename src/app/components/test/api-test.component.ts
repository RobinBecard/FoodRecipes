import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-api-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss'],
})
export class ApiTestComponent implements OnInit {
  searchForm!: FormGroup;
  results: any;
  loading = false;
  searchType = 'mealByName';
  errorMessage = '';

  constructor(private apiService: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      searchValue: [''],
    });
  }

  executeSearch(): void {
    this.loading = true;
    this.errorMessage = '';
    this.results = null;

    const searchValue = this.searchForm.get('searchValue')!.value;

    let apiCall: Observable<any>;

    switch (this.searchType) {
      case 'mealByName':
        apiCall = this.apiService.getMealByName(searchValue);
        break;
      case 'mealsByFirstLetter':
        if (searchValue.length > 0) {
          apiCall = this.apiService.getAllMealsByFirstLetter(searchValue[0]);
        } else {
          this.errorMessage = 'Veuillez entrer au moins une lettre';
          this.loading = false;
          return;
        }
        break;
      case 'mealById':
        apiCall = this.apiService.getMealById(searchValue);
        break;
      case 'randomMeal':
        apiCall = this.apiService.getSingleRandomMeal();
        break;
      case 'allCategories':
        apiCall = this.apiService.getAllMealCategories();
        break;
      case 'allAreas':
        apiCall = this.apiService.getAllAreas();
        break;
      case 'allIngredients':
        apiCall = this.apiService.getAllIngredients();
        break;
      case 'filterByIngredient':
        apiCall =
          this.apiService.getAllMealsFilterByMainIngredient(searchValue);
        break;
      case 'filterByCategory':
        apiCall = this.apiService.getAllMealsFilterByCategory(searchValue);
        break;
      case 'filterByArea':
        apiCall = this.apiService.getAllMealsFilterByArea(searchValue);
        break;
      default:
        this.errorMessage = 'Type de recherche non reconnu';
        this.loading = false;
        return;
    }

    apiCall.subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = `Erreur lors de la requête: ${error.message}`;
        this.loading = false;
      },
    });
  }

  setSearchType(type: string): void {
    this.searchType = type;
    this.results = null;
    this.errorMessage = '';

    // Réinitialiser la valeur de recherche pour certains types qui n'en ont pas besoin
    if (
      ['randomMeal', 'allCategories', 'allAreas', 'allIngredients'].includes(
        type
      )
    ) {
      this.searchForm.get('searchValue')?.setValue('');
    }
  }
}
