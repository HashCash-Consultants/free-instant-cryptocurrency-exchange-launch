import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatgptChatBotComponent } from './chatgpt-chat-bot.component';

describe('ChatgptChatBotComponent', () => {
  let component: ChatgptChatBotComponent;
  let fixture: ComponentFixture<ChatgptChatBotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatgptChatBotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatgptChatBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
