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
  matchScore?: number; // score de correspondance pour la recommandation
}

export interface MealSimplify {
  strMeal: string;
  strMealThumb: string; // URL
  idMeal: string;
}