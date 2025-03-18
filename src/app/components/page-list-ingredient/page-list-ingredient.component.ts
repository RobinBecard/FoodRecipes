import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { ListIngredientService } from '../../service/list-ingredient.service';
import { Ingredient } from '../../models/ingredient.model';

@Component({
  selector: 'app-page-list-ingredient',
  templateUrl: './page-list-ingredient.component.html',
  styleUrl: './page-list-ingredient.component.css',
  standalone:false,
})

export class PageListIngredientComponent implements OnInit {
  rigthIngredient: Ingredient[] = [];
  leftIngredient: Ingredient[] = [];
  allIngredient: Ingredient[] = []; //Liste pour tous les ingrédients
  filteredIngredients: Ingredient[] = [];
  listName: string = '';
  searchText: string = '';
  isLoading: boolean = true;
  
  constructor(
    private apiService: ApiService,
    private listService: ListIngredientService,
    private router: Router
  ) {}
  
  ngOnInit() {
    // Charger les ingrédients depuis l'API TheMealDB
    this.apiService.getAllIngredients().subscribe(ingredients => {
      this.allIngredient = ingredients;
      // Limiter à un nombre raisonnable d'ingrédients pour l'affichage
      this.leftIngredient = ingredients.slice(0,50);
      this.filteredIngredients = [...this.leftIngredient];
      this.isLoading = false;
    });
  }
  
  drop(event: CdkDragDrop<Ingredient[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Créer une copie de l'ingrédient lors du transfert pour éviter les problèmes de référence
      const item = {...event.previousContainer.data[event.previousIndex]};
      event.container.data.splice(event.currentIndex, 0, item);
    }
  }
  
  saveList() {
    if (!this.listName) {
      alert('Veuillez donner un nom à votre liste');
      return;
    }
    
    if (this.rigthIngredient.length === 0) {
      alert('Votre liste doit contenir au moins un ingrédient');
      return;
    }
    
    this.listService.saveIngredientList(this.listName, this.rigthIngredient)
      .then(id => {
        console.log('Liste enregistrée avec ID:', id);
        this.router.navigate(['/main']);
      })
      .catch(error => {
        console.error('Erreur lors de l\'enregistrement:', error);
        alert('Une erreur est survenue lors de l\'enregistrement');
      });
  }
  
  filterIngredients() {
    if (!this.searchText) {
      // Si le champ de recherche est vide, afficher les 50 premiers ingrédients
      this.filteredIngredients = this.allIngredient.slice(0, 50);
    } else {
      // Filtrer tous les ingrédients en fonction de la recherche
      const filtered = this.allIngredient.filter((ing) =>
        ing.strIngredient.toLowerCase().includes(this.searchText.toLowerCase())
      );
      // Afficher uniquement les 50 premiers résultats filtrés
      this.filteredIngredients = filtered.slice(0, 50);
    }
  }

  removeFromRight(index: number) {
    this.rigthIngredient.splice(index, 1);
  }
}