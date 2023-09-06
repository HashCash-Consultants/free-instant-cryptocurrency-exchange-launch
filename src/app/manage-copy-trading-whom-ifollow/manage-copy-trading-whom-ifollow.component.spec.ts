import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCopyTradingWhomIFollowComponent } from './manage-copy-trading-whom-ifollow.component';

describe('ManageCopyTradingWhomIFollowComponent', () => {
  let component: ManageCopyTradingWhomIFollowComponent;
  let fixture: ComponentFixture<ManageCopyTradingWhomIFollowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCopyTradingWhomIFollowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCopyTradingWhomIFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
