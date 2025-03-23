import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Ingredient, IngredientList } from '../models/ingredient.model';
import { Meal } from '../models/meal.model';
import { ApiService } from './api.service';
import { FilterService } from './filter.service';

describe('FilterService', () => {
  let service: FilterService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  // Mock data
  const mockMeals: Meal[] = [
    {
      idMeal: '1',
      strMeal: 'Pasta Carbonara',
      strCategory: 'Pasta',
      strArea: 'Italian',
      strInstructions: 'Cook pasta, mix with eggs and cheese',
      strMealThumb: 'http://example.com/pasta.jpg',
      strYoutube: 'http://youtube.com/pasta',
      strIngredients: ['Pasta', 'Eggs', 'Cheese', 'Bacon'],
      strMeasures: ['200g', '2', '50g', '100g'],
      strSource: 'http://example.com/source',
      matchScore: 0,
    },
    {
      idMeal: '2',
      strMeal: 'Pizza Margherita',
      strCategory: 'Pizza',
      strArea: 'Italian',
      strInstructions: 'Make dough, add tomato and cheese',
      strMealThumb: 'http://example.com/pizza.jpg',
      strYoutube: 'http://youtube.com/pizza',
      strIngredients: ['Flour', 'Tomato', 'Mozzarella', 'Basil', 'Cheese'],
      strMeasures: ['300g', '200g', '150g', '10g'],
      strSource: 'http://example.com/source',
      matchScore: 0,
    },
    {
      idMeal: '3',
      strMeal: 'Tacos',
      strCategory: 'Mexican',
      strArea: 'Mexican',
      strInstructions: 'Prepare tortillas and fillings',
      strMealThumb: 'http://example.com/tacos.jpg',
      strYoutube: 'http://youtube.com/tacos',
      strIngredients: ['Tortillas', 'Beef', 'Tomato', 'Lettuce'],
      strMeasures: ['4', '200g', '100g', '50g'],
      strSource: 'http://example.com/source',
      matchScore: 0,
    },
  ];

  const mockIngredients: Ingredient[] = [
    { idIngredient: '1', strIngredient: 'Tomato' },
    { idIngredient: '2', strIngredient: 'Cheese' },
    { idIngredient: '3', strIngredient: 'Pasta' },
  ];

  const mockIngredientLists: IngredientList[] = [
    {
      id: '1',
      name: 'Italian Basics',
      ingredients: [
        { idIngredient: '1', strIngredient: 'Tomato' },
        { idIngredient: '2', strIngredient: 'Cheese' },
      ],
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    // Create a spy for the ApiService
    const spy = jasmine.createSpyObj('ApiService', [
      'getSingleRandomMeal',
      'getMealByName',
      'getAllMealsFilterByCategory',
      'getAllMealsFilterByArea',
      'getAllMealsByFirstLetter',
      'getAllMealsFilterByMainIngredient',
    ]);

    TestBed.configureTestingModule({
      providers: [FilterService, { provide: ApiService, useValue: spy }],
    });

    service = TestBed.inject(FilterService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Filter State Management', () => {
    it('should initialize with empty filters', () => {
      const initialState = service.filterState;
      expect(initialState.search.value).toBe('');
      expect(initialState.search.active).toBeFalse();
      expect(initialState.category.value).toBe('');
      expect(initialState.category.active).toBeFalse();
      expect(initialState.region.value).toBe('');
      expect(initialState.region.active).toBeFalse();
      expect(initialState.letter.value).toBe('');
      expect(initialState.letter.active).toBeFalse();
      expect(initialState.ingredientsList.value).toBe('');
      expect(initialState.ingredientsList.active).toBeFalse();
    });

    it('should set filter correctly', () => {
      service.setFilter('search', 'pasta', true);
      expect(service.filterState.search.value).toBe('pasta');
      expect(service.filterState.search.active).toBeTrue();
    });

    it('should reset filters correctly', () => {
      service.setFilter('search', 'pasta', true);
      service.setFilter('category', 'Italian', true);

      service.resetFilters();

      expect(service.filterState.search.value).toBe('');
      expect(service.filterState.search.active).toBeFalse();
      expect(service.filterState.category.value).toBe('');
      expect(service.filterState.category.active).toBeFalse();
    });
  });

  describe('Filter Methods', () => {
    it('should search meals by name', (done) => {
      apiServiceSpy.getMealByName.and.returnValue(of([mockMeals[0]]));

      service.searchMeals('pasta').subscribe((meals) => {
        expect(meals.length).toBe(1);
        expect(meals[0].strMeal).toBe('Pasta Carbonara');
        expect(apiServiceSpy.getMealByName).toHaveBeenCalledWith('pasta');
        done();
      });
    });

    it('should filter by category', (done) => {
      apiServiceSpy.getAllMealsFilterByCategory.and.returnValue(
        of([mockMeals[0]])
      );

      service.filterByCategory('Pasta').subscribe((meals) => {
        expect(meals.length).toBe(1);
        expect(meals[0].strCategory).toBe('Pasta');
        expect(apiServiceSpy.getAllMealsFilterByCategory).toHaveBeenCalledWith(
          'Pasta'
        );
        done();
      });
    });

    it('should filter by region', (done) => {
      apiServiceSpy.getAllMealsFilterByArea.and.returnValue(
        of([mockMeals[0], mockMeals[1]])
      );

      service.filterByRegion('Italian').subscribe((meals) => {
        expect(meals.length).toBe(2);
        expect(meals[0].strArea).toBe('Italian');
        expect(meals[1].strArea).toBe('Italian');
        expect(apiServiceSpy.getAllMealsFilterByArea).toHaveBeenCalledWith(
          'Italian'
        );
        done();
      });
    });

    it('should filter by first letter', (done) => {
      apiServiceSpy.getAllMealsByFirstLetter.and.returnValue(
        of([mockMeals[0], mockMeals[1]])
      );

      service.filterByFirstLetter('P').subscribe((meals) => {
        expect(meals.length).toBe(2);
        expect(meals[0].strMeal.charAt(0).toUpperCase()).toBe('P');
        expect(meals[1].strMeal.charAt(0).toUpperCase()).toBe('P');
        expect(apiServiceSpy.getAllMealsByFirstLetter).toHaveBeenCalledWith(
          'P'
        );
        done();
      });
    });

    it('should filter by ingredients list', (done) => {
      apiServiceSpy.getAllMealsFilterByMainIngredient
        .withArgs('Tomato')
        .and.returnValue(of([mockMeals[1], mockMeals[2]]));
      apiServiceSpy.getAllMealsFilterByMainIngredient
        .withArgs('Cheese')
        .and.returnValue(of([mockMeals[0], mockMeals[1]]));

      service
        .filterByIngredientsList('Italian Basics', mockIngredientLists)
        .subscribe((meals) => {
          expect(meals.length).toBe(3);
          // Pizza has both Tomato and Cheese, so it should have a higher score
          expect(meals[0].idMeal).toBe('2'); // Pizza Margherita
          done();
        });
    });

    it('should return empty array when ingredient list is not found', (done) => {
      service
        .filterByIngredientsList('Non-existent List', mockIngredientLists)
        .subscribe((meals) => {
          expect(meals.length).toBe(0);
          done();
        });
    });
  });

  describe('applyFilters', () => {
    it('should return empty array when no filters are active', (done) => {
      service.resetFilters();

      service.applyFilters().subscribe((meals) => {
        expect(meals.length).toBe(0);
        done();
      });
    });

    it('should apply single filter correctly', (done) => {
      service.resetFilters();
      service.setFilter('category', 'Pasta', true);

      apiServiceSpy.getAllMealsFilterByCategory.and.returnValue(
        of([mockMeals[0]])
      );

      service.applyFilters().subscribe((meals) => {
        expect(meals.length).toBe(1);
        expect(meals[0].strMeal).toBe('Pasta Carbonara');
        done();
      });
    });

    it('should apply multiple filters with intersection', (done) => {
      service.resetFilters();
      service.setFilter('region', 'Italian', true);
      service.setFilter('search', 'pasta', true);

      apiServiceSpy.getAllMealsFilterByArea.and.returnValue(
        of([mockMeals[0], mockMeals[1]])
      ); // Italian meals
      apiServiceSpy.getMealByName.and.returnValue(of([mockMeals[0]])); // Pasta meals

      service.applyFilters().subscribe((meals) => {
        expect(meals.length).toBe(1);
        expect(meals[0].strMeal).toBe('Pasta Carbonara');
        expect(meals[0].strArea).toBe('Italian');
        done();
      });
    });

    it('should return empty array when filters have no intersection', (done) => {
      service.resetFilters();
      service.setFilter('region', 'Mexican', true);
      service.setFilter('category', 'Pasta', true);

      apiServiceSpy.getAllMealsFilterByArea.and.returnValue(of([mockMeals[2]])); // Mexican meals
      apiServiceSpy.getAllMealsFilterByCategory.and.returnValue(
        of([mockMeals[0]])
      ); // Pasta meals

      service.applyFilters().subscribe((meals) => {
        expect(meals.length).toBe(0);
        done();
      });
    });
  });

  describe('loadRandomMeals', () => {
    it('should load the correct number of random meals', (done) => {
      apiServiceSpy.getSingleRandomMeal.and.returnValues(
        of(mockMeals[0]),
        of(mockMeals[1]),
        of(mockMeals[2])
      );

      service.loadRandomMeals(3).subscribe((meals) => {
        expect(meals.length).toBe(3);
        expect(apiServiceSpy.getSingleRandomMeal).toHaveBeenCalledTimes(3);
        done();
      });
    });

    it('should filter out duplicate random meals', (done) => {
      apiServiceSpy.getSingleRandomMeal.and.returnValues(
        of(mockMeals[0]),
        of(mockMeals[0]), // Duplicate
        of(mockMeals[1])
      );

      service.loadRandomMeals(3).subscribe((meals) => {
        expect(meals.length).toBe(2);
        expect(apiServiceSpy.getSingleRandomMeal).toHaveBeenCalledTimes(3);
        done();
      });
    });
  });

  describe('calculateMatchScore', () => {
    it('should calculate correct match score', () => {
      const ingredients: Ingredient[] = [
        { idIngredient: '1', strIngredient: 'Tomato' },
        { idIngredient: '2', strIngredient: 'Cheese' },
        { idIngredient: '3', strIngredient: 'Basil' },
      ];

      // Pizza has Tomato, Mozzarella (matches Cheese), and Basil - 3/3 ingredients
      const score1 = service.calculateMatchScore(mockMeals[1], ingredients);
      expect(score1).toBe(100);

      // Pasta has Cheese but not Tomato or Basil - 1/3 ingredients
      const score2 = service.calculateMatchScore(mockMeals[0], ingredients);
      expect(score2).toBeCloseTo(33.33, 0);

      // Tacos has Tomato but not Cheese or Basil - 1/3 ingredients
      const score3 = service.calculateMatchScore(mockMeals[2], ingredients);
      expect(score3).toBeCloseTo(33.33, 0);
    });
  });
});
