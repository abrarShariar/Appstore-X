import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotModalComponent } from './slot-modal.component';

describe('SlotModalComponent', () => {
  let component: SlotModalComponent;
  let fixture: ComponentFixture<SlotModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
