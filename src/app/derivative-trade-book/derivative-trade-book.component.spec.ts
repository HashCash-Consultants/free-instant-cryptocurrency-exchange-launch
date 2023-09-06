import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivativeTradeBookComponent } from './derivative-trade-book.component';

describe('DerivativeTradeBookComponent', () => {
  let component: DerivativeTradeBookComponent;
  let fixture: ComponentFixture<DerivativeTradeBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DerivativeTradeBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivativeTradeBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
