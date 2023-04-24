import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupWithFacebookComponent } from './signup-with-facebook.component';

describe('SignupWithFacebookComponent', () => {
  let component: SignupWithFacebookComponent;
  let fixture: ComponentFixture<SignupWithFacebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupWithFacebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupWithFacebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
