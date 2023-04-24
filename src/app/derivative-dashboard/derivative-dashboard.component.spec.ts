import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivativeDashboardComponent } from './derivative-dashboard.component';

describe('DerivativeDashboardComponent', () => {
  let component: DerivativeDashboardComponent;
  let fixture: ComponentFixture<DerivativeDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DerivativeDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivativeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
