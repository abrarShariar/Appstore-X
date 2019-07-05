import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotsRandomHistoryComponent } from './slots-random-history.component';

describe('SlotsRandomHistoryComponent', () => {
  let component: SlotsRandomHistoryComponent;
  let fixture: ComponentFixture<SlotsRandomHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotsRandomHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotsRandomHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
