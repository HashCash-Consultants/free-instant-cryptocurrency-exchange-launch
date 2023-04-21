import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtcRevisedComponent } from './otc-revised.component';

describe('OtcRevisedComponent', () => {
  let component: OtcRevisedComponent;
  let fixture: ComponentFixture<OtcRevisedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtcRevisedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtcRevisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
