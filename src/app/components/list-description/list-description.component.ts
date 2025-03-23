import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IngredientList } from '../../models/ingredient.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-description',
  templateUrl: './list-description.component.html',
  styleUrls: ['./list-description.component.css'],
  standalone: false
})
export class ListDescriptionComponent implements OnInit {
  ingredientList!: IngredientList;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IngredientList,  // L'ID et les autres données sont injectés ici
    private router: Router,
    private dialogRef: MatDialogRef<ListDescriptionComponent>
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.ingredientList = this.data;
      
      // Conversion du Timestamp en objet Date
      if (this.ingredientList.createdAt) {
        this.ingredientList.createdAt = this.convertTimestampToDate(this.ingredientList.createdAt);
      }
    }
  }

  // Méthode pour convertir un Timestamp en Date
  convertTimestampToDate(timestamp: any): Date {
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000); // Conversion de la valeur Timestamp en millisecondes
    }
    return new Date(); // Retourne la date actuelle si la conversion échoue
  }
    
  // Méthode pour modifier la liste en naviguant vers la page de modification avec l'ID
  editList(listID: string): void {
    this.router.navigate(['/EditList', listID]); // On navigue vers la page EditList en passant l'ID de la liste
    this.dialogRef.close();
  }
}
