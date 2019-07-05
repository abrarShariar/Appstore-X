import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptogramPage } from './cryptogram.page';

describe('CryptogramPage', () => {
  let component: CryptogramPage;
  let fixture: ComponentFixture<CryptogramPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptogramPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptogramPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
