import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBotComponent } from './view-bot.component';

describe('ViewBotComponent', () => {
  let component: ViewBotComponent;
  let fixture: ComponentFixture<ViewBotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
