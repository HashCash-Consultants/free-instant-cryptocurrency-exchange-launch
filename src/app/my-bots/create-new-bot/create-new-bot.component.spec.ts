import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewBotComponent } from './create-new-bot.component';

describe('CreateNewBotComponent', () => {
  let component: CreateNewBotComponent;
  let fixture: ComponentFixture<CreateNewBotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewBotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
