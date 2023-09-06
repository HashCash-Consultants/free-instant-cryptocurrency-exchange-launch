import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTraderComponent } from './view-trader.component';

describe('ViewTraderComponent', () => {
  let component: ViewTraderComponent;
  let fixture: ComponentFixture<ViewTraderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTraderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
