export interface Ingredient {

  idIngredient: string;
  strIngredient: string;
  strDescription?: string;
  strType?: string;
}

export interface IngredientList {
  id?: string;
  name: string;
  ingredients: Ingredient[];
  createdAt: Date;
}