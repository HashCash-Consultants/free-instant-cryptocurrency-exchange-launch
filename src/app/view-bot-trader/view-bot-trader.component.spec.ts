import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBotTraderComponent } from './view-bot-trader.component';

describe('ViewBotTraderComponent', () => {
  let component: ViewBotTraderComponent;
  let fixture: ComponentFixture<ViewBotTraderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBotTraderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBotTraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
