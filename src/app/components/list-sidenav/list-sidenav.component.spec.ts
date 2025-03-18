import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSidenavComponent } from './list-sidenav.component';

describe('ListSidenavComponent', () => {
  let component: ListSidenavComponent;
  let fixture: ComponentFixture<ListSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSidenavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
