import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyTradingHistoryComponent } from './copy-trading-history.component';

describe('CopyTradingHistoryComponent', () => {
  let component: CopyTradingHistoryComponent;
  let fixture: ComponentFixture<CopyTradingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyTradingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyTradingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
