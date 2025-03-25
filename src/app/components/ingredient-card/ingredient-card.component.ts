import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ingredient } from '../../models/ingredient.model';

@Component({
  selector: 'app-ingredient-card',
  templateUrl: './ingredient-card.component.html',
  styleUrl: './ingredient-card.component.css',
  standalone: false
})
export class IngredientCardComponent {
  @Input() ingredient: Ingredient = {
    idIngredient: '',
    strIngredient: '',
    strDescription: '',
    strType: '',
  };
  @Input() index: number = -1;
  @Input() enableDrag: boolean = true;
  @Output() delete = new EventEmitter<number>();

  onRemove() {
    this.delete.emit(this.index);
  }
}