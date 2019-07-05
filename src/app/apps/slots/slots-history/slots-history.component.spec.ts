import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotsHistoryComponent } from './slots-history.component';

describe('SlotsHistoryComponent', () => {
  let component: SlotsHistoryComponent;
  let fixture: ComponentFixture<SlotsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
