import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptogramHomeComponent } from './cryptogram-home.component';

describe('CryptogramHomeComponent', () => {
  let component: CryptogramHomeComponent;
  let fixture: ComponentFixture<CryptogramHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptogramHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptogramHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
