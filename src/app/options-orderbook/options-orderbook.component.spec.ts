import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsOrderbookComponent } from './options-orderbook.component';

describe('OptionsOrderbookComponent', () => {
  let component: OptionsOrderbookComponent;
  let fixture: ComponentFixture<OptionsOrderbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsOrderbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsOrderbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
