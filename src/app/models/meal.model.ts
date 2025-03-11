export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string; // URL
  strYoutube: string; // URL
  strIngredients: string[];
  strMeasures: string[];
  strSource: string; // URL
}

export interface MealSimplify {
  strMeal: string;
  strMealThumb: string; // URL
  idMeal: string;
}

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strMealThumb?: string;
}
