import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialPagePage } from './initial-page.page';

describe('InitialPagePage', () => {
  let component: InitialPagePage;
  let fixture: ComponentFixture<InitialPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
