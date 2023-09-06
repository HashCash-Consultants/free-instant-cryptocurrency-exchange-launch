import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCopyTradingMyFollowersComponent } from './manage-copy-trading-my-followers.component';

describe('ManageCopyTradingMyFollowersComponent', () => {
  let component: ManageCopyTradingMyFollowersComponent;
  let fixture: ComponentFixture<ManageCopyTradingMyFollowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCopyTradingMyFollowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCopyTradingMyFollowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
