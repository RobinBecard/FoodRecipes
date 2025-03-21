import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { ListIngredientService } from '../service/list-ingredient.service';
import { Ingredient, IngredientList } from '../models/ingredient.model';


@Component({
  selector: 'app-modify-list-ingredient',
  standalone: false,
  templateUrl: './modify-list-ingredient.component.html',
  styleUrl: './modify-list-ingredient.component.css'
})

export class ModifyListIngredientComponent implements OnInit {
  rigthIngredient: Ingredient[] = []; // Liste des ingrédients à droite, la liste de l'utilisateur
  leftIngredient: Ingredient[] = []; // Liste des ingrédients à gauche
  allIngredient: Ingredient[] = []; //Liste pour tous les ingrédients
  filteredIngredients: Ingredient[] = [];
  listName: string = '';
  searchText: string = '';
  isLoading: boolean = true;
  listId!: string;
  listToEdit!: IngredientList;
  
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private listService: ListIngredientService,
    private router: Router
  ) {}
  
  ngOnInit() {
    //Charger l'id de la liste 
    //Charge les données de la liste à modifier
    this.route.params.subscribe(params => {
      this.listId = params['id'];
      this.loadListDetails();
    })
    // Charger les ingrédients depuis l'API
    this.apiService.getAllIngredients().subscribe(ingredients => {
      this.allIngredient = ingredients;
      // Limiter le nombre d'ingrédients à l'affichage
      this.leftIngredient = ingredients.slice(0,50);
      this.filterLeftIngredients()
      this.isLoading = false;

    });
  }

  filterLeftIngredients() {
    this.filteredIngredients = this.leftIngredient.filter(
      ing => !this.rigthIngredient.some(selectedIng => selectedIng.idIngredient === ing.idIngredient)
    );
  }  

  loadListDetails(): void {
    this.isLoading = true;
    this.listService.getListById(this.listId).subscribe(
      (list) => {
        this.listToEdit = list;
        this.isLoading = false;
        this.listName = list.name;
        this.rigthIngredient = [...list.ingredients];
      },
      (error) => {
        console.error('Erreur lors du chargement des détails de la liste:', error);
        this.isLoading = false;
      }
    );
  }

  deleteCurrentList() {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette liste ?')) {
      this.listService.deleteList(this.listId)
        .then(() => {
          console.log('Liste supprimée avec succès');
          this.router.navigate(['/main']);
        })
        .catch(error => {
          console.error('Erreur lors de la suppression:', error);
          alert('Une erreur est survenue lors de la suppression');
        });
    }
  }
  
  drop(event: CdkDragDrop<Ingredient[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
  
      if (event.previousContainer.id === 'rightList' && event.container.id === 'leftList') {
        return;
      }
  
      if (event.previousContainer.id === 'leftList' && event.container.id === 'rightList') {
        this.filteredIngredients = this.filteredIngredients.filter(ing => ing.idIngredient !== item.idIngredient);
      }
  
      event.container.data.splice(event.currentIndex, 0, item);
      event.previousContainer.data.splice(event.previousIndex, 1);
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
    // On met à jour la liste seulement si on a un ID 
    if (this.listId) {
      this.listService.updateList(this.listId, this.listName, this.rigthIngredient)
        .then(() => {
          console.log('Liste mise à jour avec succès');
          this.router.navigate(['/main']);
        })
        .catch(error => {
          console.error('Erreur lors de la mise à jour:', error);
          alert('Une erreur est survenue lors de la mise à jour');
        });
    }
  }
  
  filterIngredients() {
    if (!this.searchText) {
      // Si la recherche est vide, afficher les 50 premiers ingrédients filtrés
      this.filteredIngredients = this.leftIngredient
        .filter(ing => !this.rigthIngredient.some(selectedIng => selectedIng.idIngredient === ing.idIngredient))
        .slice(0, 50);
    } else {
      // Filtrer d'abord par le texte de recherche
      const filtered = this.leftIngredient.filter(ing =>
        ing.strIngredient.toLowerCase().includes(this.searchText.toLowerCase())
      );

      // Ensuite, exclure les ingrédients déjà à droite
      this.filteredIngredients = filtered.filter(ing =>
        !this.rigthIngredient.some(selectedIng => selectedIng.idIngredient === ing.idIngredient)
      ).slice(0, 50);
    }
  }

  // Supprimer de la liste à droite un ingrédient
  removeFromRight(index: number) {
    const removedIngredient = this.rigthIngredient.splice(index, 1)[0];

    // On vérifie que l'ingrédient n'est pas déjà présent dans la liste de gauche avant de l'ajouter en début de liste
    if (!this.filteredIngredients.some(ing => ing.idIngredient === removedIngredient.idIngredient)) {
      this.filteredIngredients.unshift(removedIngredient);
    }
  }
}
