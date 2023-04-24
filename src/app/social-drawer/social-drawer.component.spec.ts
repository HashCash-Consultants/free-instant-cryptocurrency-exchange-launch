import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialDrawerComponent } from './social-drawer.component';

describe('SocialDrawerComponent', () => {
  let component: SocialDrawerComponent;
  let fixture: ComponentFixture<SocialDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
