import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivativeOrderbookComponent } from './derivative-orderbook.component';

describe('DerivativeOrderbookComponent', () => {
  let component: DerivativeOrderbookComponent;
  let fixture: ComponentFixture<DerivativeOrderbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DerivativeOrderbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivativeOrderbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
