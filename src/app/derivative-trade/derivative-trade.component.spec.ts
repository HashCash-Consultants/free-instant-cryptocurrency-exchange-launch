import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivativeTradeComponent } from './derivative-trade.component';

describe('DerivativeTradeComponent', () => {
  let component: DerivativeTradeComponent;
  let fixture: ComponentFixture<DerivativeTradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DerivativeTradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivativeTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
