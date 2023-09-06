import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsDepthChartComponent } from './options-depth-chart.component';

describe('OptionsDepthChartComponent', () => {
  let component: OptionsDepthChartComponent;
  let fixture: ComponentFixture<OptionsDepthChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsDepthChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsDepthChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
