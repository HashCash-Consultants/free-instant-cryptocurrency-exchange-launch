import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsTvchartcontainerComponent } from './options-tvchartcontainer.component';

describe('OptionsTvchartcontainerComponent', () => {
  let component: OptionsTvchartcontainerComponent;
  let fixture: ComponentFixture<OptionsTvchartcontainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsTvchartcontainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsTvchartcontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
