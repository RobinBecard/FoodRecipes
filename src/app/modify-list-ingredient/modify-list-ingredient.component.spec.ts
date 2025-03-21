import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyListIngredientComponent } from './modify-list-ingredient.component';

describe('ModifyListIngredientComponent', () => {
  let component: ModifyListIngredientComponent;
  let fixture: ComponentFixture<ModifyListIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyListIngredientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyListIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
