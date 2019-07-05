import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotsHomeComponent } from './slots-home.component';

describe('SlotsHomeComponent', () => {
  let component: SlotsHomeComponent;
  let fixture: ComponentFixture<SlotsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
