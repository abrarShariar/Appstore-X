import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MnemonicViewComponent } from './mnemonic-view.component';

describe('MnemonicViewComponent', () => {
  let component: MnemonicViewComponent;
  let fixture: ComponentFixture<MnemonicViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MnemonicViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MnemonicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
