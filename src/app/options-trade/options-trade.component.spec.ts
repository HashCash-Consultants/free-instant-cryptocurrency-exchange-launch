import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsTradeComponent } from './options-trade.component';

describe('OptionsTradeComponent', () => {
  let component: OptionsTradeComponent;
  let fixture: ComponentFixture<OptionsTradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsTradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
