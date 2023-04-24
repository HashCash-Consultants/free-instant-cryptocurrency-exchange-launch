import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivativeStoplossComponent } from './derivative-stoploss.component';

describe('DerivativeStoplossComponent', () => {
  let component: DerivativeStoplossComponent;
  let fixture: ComponentFixture<DerivativeStoplossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DerivativeStoplossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivativeStoplossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
