export interface Filter {
  value: string;
  active: boolean;
}

export interface FilterState {
  search: Filter;
  category: Filter;
  region: Filter;
  letter: Filter;
  ingredientsList: Filter;
}
