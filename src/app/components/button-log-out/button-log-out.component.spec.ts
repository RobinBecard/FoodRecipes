import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonLogOutComponent } from './button-log-out.component';

describe('ButtonLogOutComponent', () => {
  let component: ButtonLogOutComponent;
  let fixture: ComponentFixture<ButtonLogOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonLogOutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonLogOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
