import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsChartComponent } from './options-chart.component';

describe('OptionsChartComponent', () => {
  let component: OptionsChartComponent;
  let fixture: ComponentFixture<OptionsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
