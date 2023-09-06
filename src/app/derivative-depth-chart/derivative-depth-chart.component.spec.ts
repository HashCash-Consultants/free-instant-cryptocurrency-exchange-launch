import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivativeDepthChartComponent } from './derivative-depth-chart.component';

describe('DerivativeDepthChartComponent', () => {
  let component: DerivativeDepthChartComponent;
  let fixture: ComponentFixture<DerivativeDepthChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DerivativeDepthChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivativeDepthChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
