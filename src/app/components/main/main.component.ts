import { Component, ElementRef, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray,  CdkDrag, CdkDropList,transferArrayItem } from '@angular/cdk/drag-drop';

interface Recipe {
  id: string;
  name: string;
  calories: number;
  image?: string;
}

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    standalone: false
})

export class MainComponent {
  @ViewChild('filterType', { static: false }) filterButton!: ElementRef;

  sidebarRecipes: Recipe[] = [
    { id: '1', name: 'Patates, tomate', calories: 544 },
    { id: '2', name: 'Plat #1', calories: 450 },
  ];

  mainRecipes: Recipe[] = Array(10).fill(null).map((_, i) => ({
    id: `main-${i}`,
    name: 'Patates, tomate',
    calories: 544
  }));

  filteredRecipes: Recipe[] = [...this.mainRecipes];

  categories: string[] = [
    'Catégorie 1', 'Catégorie 2', 'Catégorie 3',
    'Catégorie 4', 'Catégorie 5', 'Catégorie 6',
    'Catégorie 7','Catégorie 8', 'Catégorie 9', 'Catégorie 10',
    'Catégorie 11', 'Catégorie 12', 'Catégorie 13',
    'Catégorie 14'
  ];

  regions: string[] = [
    'Région 1', 'Région 2', 'Région 3',
    'Région 4', 'Région 5', 'Région 6'
  ];

  selectedFilter: string = '';
  menuStyle: any = {};

  drop(event: CdkDragDrop<Recipe[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  updateFilterPosition(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedFilter = selectedValue;

    // Récupérer la position du bouton filtre
    const button = (event.target as HTMLSelectElement).getBoundingClientRect();
    const screenWidth = window.innerWidth;

    // Vérifier si le menu peut s'afficher à droite ou s'il doit passer à gauche
    if (screenWidth - button.right > 220) {
      this.menuStyle = { left: `${button.right + 5}px`, top: `${button.bottom + 5}px` };
    } else {
      this.menuStyle = { left: `${button.left - 205}px`, top: `${button.bottom + 5}px` };
    }
  }

  filterByCategory(category: string) {
    console.log('Filtre par catégorie:', category);
    this.filteredRecipes = this.mainRecipes.filter(recipe => recipe.name.includes(category));
  }

  filterByRegion(region: string) {
    console.log('Filtre par région:', region);
    this.filteredRecipes = this.mainRecipes.filter(recipe => recipe.name.includes(region));
  }
}
