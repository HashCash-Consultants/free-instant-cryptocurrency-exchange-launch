import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureTokenComponent } from './secure-token.component';

describe('SecureTokenComponent', () => {
  let component: SecureTokenComponent;
  let fixture: ComponentFixture<SecureTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecureTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecureTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
