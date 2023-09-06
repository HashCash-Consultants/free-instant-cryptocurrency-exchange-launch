import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApiKeyComponent } from './add-api-key.component';

describe('AddApiKeyComponent', () => {
  let component: AddApiKeyComponent;
  let fixture: ComponentFixture<AddApiKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddApiKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApiKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
