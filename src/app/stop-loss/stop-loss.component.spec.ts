import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopLossComponent } from './stop-loss.component';

describe('StopLossComponent', () => {
  let component: StopLossComponent;
  let fixture: ComponentFixture<StopLossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopLossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopLossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
