import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendViewComponent } from './send-view.component';

describe('SendViewComponent', () => {
  let component: SendViewComponent;
  let fixture: ComponentFixture<SendViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
