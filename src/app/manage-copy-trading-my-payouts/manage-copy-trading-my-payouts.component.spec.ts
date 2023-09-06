import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCopyTradingMyPayoutsComponent } from './manage-copy-trading-my-payouts.component';

describe('ManageCopyTradingMyPayoutsComponent', () => {
  let component: ManageCopyTradingMyPayoutsComponent;
  let fixture: ComponentFixture<ManageCopyTradingMyPayoutsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCopyTradingMyPayoutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCopyTradingMyPayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
