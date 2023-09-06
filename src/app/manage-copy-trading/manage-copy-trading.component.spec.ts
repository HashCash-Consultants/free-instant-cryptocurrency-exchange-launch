import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCopyTradingComponent } from './manage-copy-trading.component';

describe('ManageCopyTradingComponent', () => {
  let component: ManageCopyTradingComponent;
  let fixture: ComponentFixture<ManageCopyTradingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCopyTradingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCopyTradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
