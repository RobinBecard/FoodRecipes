import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestInfoLogComponent } from './test-info-log.component';

describe('TestInfoLogComponent', () => {
  let component: TestInfoLogComponent;
  let fixture: ComponentFixture<TestInfoLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestInfoLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestInfoLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
