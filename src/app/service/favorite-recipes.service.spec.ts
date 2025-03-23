import { TestBed } from '@angular/core/testing';

import { FavoriteRecipesService } from './favorite-recipes.service';

describe('FavoriteRecipesService', () => {
  let service: FavoriteRecipesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteRecipesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
