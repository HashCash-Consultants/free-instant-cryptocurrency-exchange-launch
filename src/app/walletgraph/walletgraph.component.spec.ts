import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletgraphComponent } from './walletgraph.component';

describe('WalletgraphComponent', () => {
  let component: WalletgraphComponent;
  let fixture: ComponentFixture<WalletgraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletgraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
