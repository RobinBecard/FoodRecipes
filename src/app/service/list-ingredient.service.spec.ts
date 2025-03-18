import { TestBed } from '@angular/core/testing';

import { ListIngredientService } from './list-ingredient.service';

describe('ListIngredientService', () => {
  let service: ListIngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListIngredientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
