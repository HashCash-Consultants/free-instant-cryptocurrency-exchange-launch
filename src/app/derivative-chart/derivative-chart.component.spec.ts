import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivativeChartComponent } from './derivative-chart.component';

describe('DerivativeChartComponent', () => {
  let component: DerivativeChartComponent;
  let fixture: ComponentFixture<DerivativeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DerivativeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivativeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
