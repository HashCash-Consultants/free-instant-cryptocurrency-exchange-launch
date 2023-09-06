import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsTradeBookComponent } from './options-trade-book.component';

describe('OptionsTradeBookComponent', () => {
  let component: OptionsTradeBookComponent;
  let fixture: ComponentFixture<OptionsTradeBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsTradeBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsTradeBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
