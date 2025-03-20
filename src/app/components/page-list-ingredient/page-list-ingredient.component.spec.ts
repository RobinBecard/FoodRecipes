import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageListIngredientComponent } from './page-list-ingredient.component';

describe('PageListIngredientComponent', () => {
  let component: PageListIngredientComponent;
  let fixture: ComponentFixture<PageListIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageListIngredientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageListIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
