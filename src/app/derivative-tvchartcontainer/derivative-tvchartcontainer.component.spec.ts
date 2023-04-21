import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivativeTvchartcontainerComponent } from './derivative-tvchartcontainer.component';

describe('DerivativeTvchartcontainerComponent', () => {
  let component: DerivativeTvchartcontainerComponent;
  let fixture: ComponentFixture<DerivativeTvchartcontainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DerivativeTvchartcontainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivativeTvchartcontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
