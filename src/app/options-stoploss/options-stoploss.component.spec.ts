import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsStoplossComponent } from './options-stoploss.component';

describe('OptionsStoplossComponent', () => {
  let component: OptionsStoplossComponent;
  let fixture: ComponentFixture<OptionsStoplossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsStoplossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsStoplossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
