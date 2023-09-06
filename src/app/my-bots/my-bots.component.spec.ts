import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBotsComponent } from './my-bots.component';

describe('MyBotsComponent', () => {
  let component: MyBotsComponent;
  let fixture: ComponentFixture<MyBotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
