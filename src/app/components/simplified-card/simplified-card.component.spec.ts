import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplifiedCardComponent } from './simplified-card.component';

describe('SimplifiedCardComponent', () => {
  let component: SimplifiedCardComponent;
  let fixture: ComponentFixture<SimplifiedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimplifiedCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimplifiedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
